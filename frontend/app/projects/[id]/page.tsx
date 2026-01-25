'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="loading">Loading editor...</div>
});
import 'react-quill-new/dist/quill.snow.css';

export default function ProjectEditorPage() {
    const { token, logout } = useAuth();
    const router = useRouter();
    const { id } = useParams();

    const [project, setProject] = useState<any>(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token && typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                router.push('/login');
            }
        } else if (token && id) {
            fetchProject();
        }
    }, [token, id, router]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setProject(data);
                setContent(data.content);
                setTitle(data.title);
            } else {
                router.push('/projects');
            }
        } catch (err) {
            console.error('Failed to fetch project', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content }),
            });
            if (response.ok) {
                setMessage('Project saved successfully!');
            } else {
                setMessage('Failed to save project.');
            }
        } catch (err) {
            setMessage('Error saving project.');
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/projects/${id}/pdf`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (err) {
            console.error('PDF Download error:', err);
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

    if (loading) return <div className="loading">Loading project...</div>;
    if (!project) return null;

    return (
        <div className="editor-container">
            <header className="editor-header">
                <button onClick={() => router.push('/projects')} className="back-link">← Back to Dashboard</button>
                <div className="header-main">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="title-input"
                        placeholder="Project Title"
                    />
                    <div className="header-actions">
                        <button onClick={handleSave} disabled={saving} className="save-btn">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={handleDownloadPDF} className="pdf-btn">
                            Download PDF
                        </button>
                    </div>
                </div>
                {message && <div className="status-msg">{message}</div>}
            </header>

            <div className="editor-workspace">
                <div className="metadata-sidebar">
                    <div className="meta-box">
                        <label>Company</label>
                        <p>{project.companyName}</p>
                    </div>
                    <div className="meta-box">
                        <label>Role</label>
                        <p>{project.role}</p>
                    </div>
                    <hr />
                    <div className="meta-box">
                        <label>Job Description Context</label>
                        <div className="scroll-p">{project.jobDescription}</div>
                    </div>
                </div>

                <div className="quill-container-wrapper">
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={quillModules}
                        formats={quillFormats}
                        className="react-quill-editor"
                    />
                </div>
            </div>

            <style jsx global>{`
        .editor-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: white;
        }
        .editor-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .back-link {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 1rem;
          padding: 0;
        }
        .back-link:hover { color: #3b82f6; }
        
        .header-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        .title-input {
          flex: 1;
          font-size: 1.5rem;
          font-weight: 700;
          background: transparent;
          border: 1px solid transparent;
          padding: 0.5rem;
          border-radius: 6px;
          color: #1e293b;
        }
        .title-input:focus {
          border-color: #cbd5e1;
          background: white;
          outline: none;
        }
        
        .header-actions { display: flex; gap: 1rem; }
        .save-btn, .pdf-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .save-btn {
          background: #3b82f6;
          color: white;
          border: none;
        }
        .save-btn:hover { background: #2563eb; }
        .save-btn:disabled { background: #94a3b8; }
        
        .pdf-btn {
          background: #10b981;
          color: white;
          border: none;
        }
        .pdf-btn:hover { background: #059669; }

        .status-msg {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #10b981;
          font-weight: 600;
        }

        .editor-workspace {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .metadata-sidebar {
          width: 300px;
          border-right: 1px solid #e2e8f0;
          padding: 2rem;
          background: #fdfdfd;
          overflow-y: auto;
        }
        .meta-box { margin-bottom: 1.5rem; }
        label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; display: block; margin-bottom: 0.5rem; }
        p { color: #334155; font-weight: 600; }
        .scroll-p { font-size: 0.9rem; color: #64748b; line-height: 1.6; max-height: 300px; overflow-y: auto; white-space: pre-wrap; }
        hr { border: none; border-top: 1px solid #f1f5f9; margin: 1.5rem 0; }

        .quill-container-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }
        .react-quill-editor {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .react-quill-editor .ql-container {
          flex: 1;
          font-size: 1.1rem;
          line-height: 1.8;
          border: none !important;
        }
        .react-quill-editor .ql-toolbar {
          border-left: none !important;
          border-right: none !important;
          border-top: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc;
        }
        .react-quill-editor .ql-editor {
          padding: 4rem;
          color: #334155;
        }

        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; color: #64748b; }
      `}</style>
        </div>
    );
}
