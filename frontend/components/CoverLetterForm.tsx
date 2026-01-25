"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { generateCoverLetter, getAvailableModels } from '@/lib/llm';
import { downloadPDF } from '@/lib/pdf';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="textarea" style={{ minHeight: '500px' }}>Loading editor...</div>
});
import 'react-quill-new/dist/quill.snow.css';

import { useAuth } from '@/lib/AuthContext';

export default function CoverLetterForm() {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        jobDescription: '',
        resumeInfo: '',
        model: '', // Will be set on mount
        userName: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchModels() {
            const models = await getAvailableModels();
            setAvailableModels(models);
            if (models.length > 0) {
                // Prefer llama3.2 if available, otherwise first one
                const defaultModel = models.includes('llama3.2:latest') ? 'llama3.2:latest' : models[0];
                setFormData(prev => ({ ...prev, model: defaultModel }));
            }
        }
        fetchModels();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.model) {
            setError('Please select an Ollama model. If none appear, ensure Ollama is running.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const text = await generateCoverLetter(formData);
            // Convert plain text to basic HTML for the editor
            const htmlText = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');
            setResult(`<p>${htmlText}</p>`);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleManualMode = () => {
        setResult('<p><br></p>');
    };

    const handleDownload = () => {
        if (result) {
            const fileName = `${formData.companyName.replace(/\s+/g, '_') || 'My'}_Cover_Letter.pdf`;
            downloadPDF(result, fileName);
        }
    };

    const handleSaveToProject = async () => {
        setSaving(true);
        setSaveMessage('');
        try {
            const response = await fetch('http://localhost:4000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: `${formData.role} at ${formData.companyName}`,
                    companyName: formData.companyName,
                    role: formData.role,
                    jobDescription: formData.jobDescription,
                    resumeInfo: formData.resumeInfo,
                    content: result // Storing HTML for now
                })
            });
            if (response.ok) {
                setSaveMessage('Saved to Projects!');
            } else {
                setSaveMessage('Failed to save.');
            }
        } catch (err) {
            setSaveMessage('Error saving.');
        } finally {
            setSaving(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'link'
    ];

    return (
        <div className="animate-fade-in">
            {!result ? (
                <form onSubmit={handleGenerate} className="glass" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2>Generator Details</h2>
                        <button type="button" onClick={handleManualMode} className="label" style={{ background: 'var(--glass-border)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}>
                            Write Manually
                        </button>
                    </div>

                    <div className="form-group">
                        <label className="label">Ollama Model</label>
                        {availableModels.length > 0 ? (
                            <select
                                className="input"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                required
                            >
                                {availableModels.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                className="input"
                                name="model"
                                placeholder="Loading models or enter manually..."
                                value={formData.model}
                                onChange={handleInputChange}
                                required
                            />
                        )}
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Showing installed models from your local Ollama instance.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="label">Your Name</label>
                            <input
                                className="input"
                                name="userName"
                                placeholder="e.g. John Doe"
                                value={formData.userName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Application Date</label>
                            <input
                                className="input"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="label">Company Name</label>
                            <input
                                className="input"
                                name="companyName"
                                placeholder="e.g. Google"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label">Target Role</label>
                            <input
                                className="input"
                                name="role"
                                placeholder="e.g. Software Engineer"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Job Description</label>
                        <textarea
                            className="textarea"
                            name="jobDescription"
                            placeholder="Paste the job description here..."
                            value={formData.jobDescription}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Your Resume / Key Skills</label>
                        <textarea
                            className="textarea"
                            name="resumeInfo"
                            placeholder="Paste your resume content or key experience here..."
                            value={formData.resumeInfo}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}

                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spin-loader"></span>
                                Generating...
                            </>
                        ) : 'Generate Cover Letter'}
                    </button>
                </form>
            ) : (
                <div className="glass" style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h2>Your Cover Letter</h2>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            {saveMessage && <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>{saveMessage}</span>}
                            <button onClick={handleSaveToProject} disabled={saving} className="label" style={{ background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px' }}>
                                {saving ? 'Saving...' : 'Save as Project'}
                            </button>
                            <button onClick={() => { setResult(''); setSaveMessage(''); }} className="label" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit Info</button>
                            <button onClick={handleDownload} className="btn-primary">Download PDF</button>
                        </div>
                    </div>
                    <div className="quill-wrapper" style={{ background: 'white', borderRadius: '8px', minHeight: '600px', color: 'black' }}>
                        <ReactQuill
                            theme="snow"
                            value={result}
                            onChange={setResult}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: '550px' }}
                        />
                    </div>
                </div>
            )}

            <style jsx global>{`
                .ql-container {
                    font-size: 16px;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    background: white;
                    color: black;
                }
                .ql-toolbar {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    background: #f3f4f6;
                }
                .ql-editor {
                    min-height: 500px;
                }
                .spin-loader {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border: 2px solid white;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
