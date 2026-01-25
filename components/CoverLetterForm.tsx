"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { generateCoverLetter } from '@/lib/llm';
import { downloadPDF } from '@/lib/pdf';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="textarea" style={{ minHeight: '500px' }}>Loading editor...</div>
});
import 'react-quill-new/dist/quill.snow.css';

export default function CoverLetterForm() {
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        jobDescription: '',
        resumeInfo: '',
        model: 'llama3.2',
        userName: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.model) {
            setError('Please specify an Ollama model.');
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
                        <input
                            className="input"
                            name="model"
                            placeholder="e.g. llama3.2, mistral"
                            value={formData.model}
                            onChange={handleInputChange}
                            required
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Ensure the model is downloaded locally using `ollama pull [model]`.
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2>Your Cover Letter</h2>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setResult('')} className="label" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit Info</button>
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
