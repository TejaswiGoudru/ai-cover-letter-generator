import express, { Request, Response } from 'express';
import cors from 'cors';
import ollama, { ModelResponse } from 'ollama';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User';
import { authenticate, AuthRequest } from './middleware/auth';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-cover-letter';
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_here';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AI Cover Letter Generator API',
            version: '1.0.0',
            description: 'API for generating cover letters using local Ollama model',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ['./src/server.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @openapi
 * /api/models:
 *   get:
 *     summary: Get available Ollama models
 *     responses:
 *       200:
 *         description: List of available models
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
app.get('/api/models', async (req: Request, res: Response) => {
    try {
        const response = await ollama.list();
        res.json(response.models.map((m: ModelResponse) => m.name));
    } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ error: "Failed to fetch models" });
    }
});

/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
app.post('/api/register', async (req: Request, res: Response) => {
    try {
        const { email, password, subscriptionLevel, billingCycle, isTrial } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and contain at least one alphabet, one number, and one special character."
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const user = new User({
            email,
            password,
            subscriptionLevel: subscriptionLevel || 'standard',
            billingCycle: billingCycle || 'monthly',
            isTrial: !!isTrial,
            trialStartDate: isTrial ? new Date() : null
        });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !await (user as any).comparePassword(password)) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

/**
 * @openapi
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
app.get('/api/profile', authenticate as any, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

/**
 * @openapi
 * /api/profile:
 *   post:
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               profileEmail:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
app.post('/api/profile', authenticate as any, async (req: AuthRequest, res: Response) => {
    try {
        const { firstName, middleName, lastName, profileEmail, profilePicture, subscriptionLevel, billingCycle, isTrial } = req.body;

        const updateData: any = { firstName, middleName, lastName, profileEmail, profilePicture };
        if (subscriptionLevel) updateData.subscriptionLevel = subscriptionLevel;
        if (billingCycle) updateData.billingCycle = billingCycle;
        if (isTrial !== undefined) {
            updateData.isTrial = isTrial;
            if (isTrial && !updateData.trialStartDate) {
                updateData.trialStartDate = new Date();
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user?.id,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});

/**
 * @openapi
 * /api/generate:
 *   post:
 *     summary: Generate a cover letter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobDescription
 *               - resumeInfo
 *               - companyName
 *               - role
 *               - model
 *               - userName
 *               - date
 *             properties:
 *               jobDescription:
 *                 type: string
 *               resumeInfo:
 *                 type: string
 *               companyName:
 *                 type: string
 *               role:
 *                 type: string
 *               model:
 *                 type: string
 *               userName:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: The generated cover letter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 */
/**
 * @openapi
 * /api/chat:
 *   post:
 *     summary: Chat with AI for cover letter editing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                     content:
 *                       type: string
 *               model:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 */
app.post('/api/chat', authenticate as any, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user || user.subscriptionLevel !== 'ultimate') {
            return res.status(403).json({ error: "AI Chat is an Ultimate tier feature. Please upgrade to access." });
        }

        const { messages, model } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array is required" });
        }

        try {
            const response = await ollama.chat({
                model: model || 'llama3.2',
                messages: messages,
            });

            res.json({ message: response.message });
        } catch (error) {
            console.error("Ollama Chat Error:", error);
            res.status(500).json({ error: "Failed to process chat" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/generate', async (req: Request, res: Response) => {
    const { jobDescription, resumeInfo, companyName, role, model, userName, date } = req.body;

    const prompt = `
    Write a professional and compelling cover letter based on the following details:
    
    Date: ${date}
    Candidate Name: ${userName}
    Company Name: ${companyName}
    Target Role: ${role}
    
    Job Description:
    ${jobDescription}
    
    Candidate Skills/Experience:
    ${resumeInfo}
    
    Guidelines:
    1. The letter should be professional, confident, and tailored to the job description.
    2. Highlight how the candidate's skills align with the requirements.
    3. Use a formal tone and standard business letter format.
    4. Start the letter with the provided date: ${date}.
    5. Omit the sender's header contact info (address/phone), but include the formal greeting "Dear Hiring Manager" (or tailored if possible).
    6. Keep it concise (3-4 paragraphs).
    7. At the end, sign off with "Sincerely," followed by the candidate's name: ${userName}.
    8. CRITICAL: Do NOT include any introductory or conversational text (like "Here is the letter...") before or after the letter. Start DIRECTLY with the date.
  `;

    try {
        const response = await ollama.chat({
            model: model || 'llama3.2',
            messages: [{ role: 'user', content: prompt }],
        });

        res.json({ content: response.message.content });
    } catch (error) {
        console.error("Ollama Generation Error:", error);
        res.status(500).json({ error: "Failed to generate cover letter" });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
