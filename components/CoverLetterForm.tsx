"use client";

import React, { useState } from 'react';
import { generateCoverLetter } from '@/lib/llm';
import { downloadPDF } from '@/lib/pdf';

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
            setResult(text);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (result) {
            const fileName = `${formData.companyName.replace(/\s+/g, '_')}_Cover_Letter.pdf`;
            downloadPDF(result, fileName);
        }
    };

    return (
        <div className="animate-fade-in">
            {!result ? (
                <form onSubmit={handleGenerate} className="glass" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Generator Details</h2>

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
                                <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                Generating...
                            </>
                        ) : 'Generate Cover Letter'}
                    </button>
                </form>
            ) : (
                <div className="glass" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2>Your Cover Letter</h2>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setResult('')} className="label" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit Info</button>
                            <button onClick={handleDownload} className="btn-primary">Download PDF</button>
                        </div>
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label className="label" style={{ position: 'absolute', top: '-10px', right: '10px', background: 'var(--background)', padding: '0 8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Editable</label>
                        <textarea
                            className="textarea"
                            style={{ whiteSpace: 'pre-wrap', minHeight: '500px', width: '100%', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--glass-border)', padding: '24px' }}
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
