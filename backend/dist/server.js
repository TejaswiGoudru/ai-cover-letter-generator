"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ollama_1 = __importDefault(require("ollama"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app = (0, express_1.default)();
const port = 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
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
app.get('/api/models', async (req, res) => {
    try {
        const response = await ollama_1.default.list();
        res.json(response.models.map(m => m.name));
    }
    catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ error: "Failed to fetch models" });
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
app.post('/api/generate', async (req, res) => {
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
        const response = await ollama_1.default.chat({
            model: model || 'llama3.2',
            messages: [{ role: 'user', content: prompt }],
        });
        res.json({ content: response.message.content });
    }
    catch (error) {
        console.error("Ollama Generation Error:", error);
        res.status(500).json({ error: "Failed to generate cover letter" });
    }
});
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
