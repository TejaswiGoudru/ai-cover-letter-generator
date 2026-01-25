'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import { getAvailableModels } from '@/lib/llm';

export default function ResumeBuilderPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        title: 'My Professional Resume',
        fullName: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        education: '',
        skills: '',
        model: ''
    });

    useEffect(() => {
        if (!token && typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                router.push('/login');
            }
        } else if (token) {
            fetchModels();
        }
    }, [token, router]);

    const fetchModels = async () => {
        const models = await getAvailableModels();
        setAvailableModels(models);
        if (models.length > 0) {
            setFormData(prev => ({ ...prev, model: models.includes('llama3.2:latest') ? 'llama3.2:latest' : models[0] }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const prompt = `
Generate a professional, well-formatted resume in HTML based on the following details:
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}

Experience:
${formData.experience}

Education:
${formData.education}

Skills:
${formData.skills}

Use professional language. Format with clear sections (Professional Summary, Experience, Education, Skills). Use <h2> for section headers and <p> for body text. Use <ul> and <li> for bullet points in experience and skills.
            `;

            const response = await fetch('http://localhost:4000/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: formData.model,
                    jobDescription: "Resume Generation",
                    resumeInfo: prompt,
                    userName: formData.fullName
                })
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');

                // Save as project
                const saveResponse = await fetch('http://localhost:4000/api/projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: formData.title,
                        projectType: 'resume',
                        content: `<p>${content}</p>`
                    })
                });

                if (saveResponse.ok) {
                    const project = await saveResponse.json();
                    router.push(`/projects/${project._id}`);
                }
            }
        } catch (err) {
            console.error('Failed to generate resume', err);
        } finally {
            setLoading(false);
        }
    };

    if (!token) return null;

    return (
        <div className="builder-container">
            <header className="builder-header">
                <h1>Resume Builder</h1>
                <p>Fill in your details and let AI craft a professional resume for you.</p>
            </header>

            <form onSubmit={handleGenerate} className="builder-form glass">
                <div className="form-section">
                    <h3>Project Title</h3>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="e.g. Senior Dev Resume 2024"
                        required
                    />
                </div>

                <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="grid-2">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="input" required />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input" required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="input" />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input" placeholder="City, State/Country" />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Professional Experience</h3>
                    <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="textarea"
                        placeholder="Detail your work history, roles, and achievements..."
                        required
                    />
                </div>

                <div className="form-section">
                    <h3>Education</h3>
                    <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="textarea"
                        placeholder="List your degrees, institutions, and graduation dates..."
                        required
                    />
                </div>

                <div className="form-section">
                    <h3>Skills</h3>
                    <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        className="textarea"
                        placeholder="List your technical and soft skills..."
                        required
                    />
                </div>

                <div className="form-footer">
                    <div className="model-select">
                        <label>AI Model:</label>
                        <select name="model" value={formData.model} onChange={handleInputChange} className="input">
                            {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="generate-btn" disabled={loading}>
                        {loading ? 'Crafting Resume...' : 'Generate AI Resume'}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .builder-container {
                    padding: 3rem 2rem;
                    max-width: 900px;
                    margin: 0 auto;
                    min-height: 100vh;
                }
                .builder-header { margin-bottom: 3rem; text-align: center; }
                h1 { font-size: 2.5rem; color: #1a202c; margin-bottom: 0.5rem; }
                .builder-header p { color: #64748b; font-size: 1.1rem; }

                .builder-form {
                    padding: 2.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                }
                .form-section h3 {
                    font-size: 1.25rem;
                    color: #1a202c;
                    margin-bottom: 1.25rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }
                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                label { font-size: 0.85rem; font-weight: 600; color: #64748b; }
                
                .form-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 2rem;
                    border-top: 1px solid #e2e8f0;
                }
                .model-select { display: flex; align-items: center; gap: 1rem; }

                .generate-btn {
                    background: #3b82f6;
                    color: white;
                    padding: 1rem 2.5rem;
                    border-radius: 12px;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
                }
                .generate-btn:hover { background: #2563eb; transform: translateY(-2px); }
                .generate-btn:disabled { background: #94a3b8; cursor: not-allowed; transform: none; box-shadow: none; }
            `}</style>
        </div>
    );
}
