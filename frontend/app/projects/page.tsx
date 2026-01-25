'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
    _id: string;
    title: string;
    companyName: string;
    role: string;
    updatedAt: string;
}

export default function ProjectsPage() {
    const { token, logout } = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token && typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                router.push('/login');
            }
        } else if (token) {
            fetchProjects();
        }
    }, [token, router]);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else if (response.status === 401) {
                logout();
            }
        } catch (err) {
            console.error('Failed to fetch projects', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`http://localhost:4000/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                setProjects(projects.filter(p => p._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete project', err);
        }
    };

    if (loading) return <div className="loading">Loading projects...</div>;

    return (
        <div className="projects-container">
            <header className="projects-header">
                <h1>My Projects</h1>
                <p>Manage and edit your saved cover letters</p>
            </header>

            {projects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📂</div>
                    <h2>No projects yet</h2>
                    <p>Generate a cover letter and save it to see it here.</p>
                    <Link href="/" className="create-btn">Create Your First Letter</Link>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <Link key={project._id} href={`/projects/${project._id}`} className="project-card">
                            <div className="project-info">
                                <h3>{project.title}</h3>
                                <p className="meta">{project.role} at {project.companyName}</p>
                                <p className="date">Last updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="project-actions">
                                <button
                                    onClick={(e) => handleDelete(e, project._id)}
                                    className="delete-link"
                                    title="Delete Project"
                                >
                                    Delete
                                </button>
                                <span className="edit-link">Edit & Export →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <style jsx>{`
        .projects-container {
          padding: 2rem;
          min-height: 100vh;
          background: #f8fafc;
        }
        .projects-header {
          margin-bottom: 3rem;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        h1 { font-size: 2.5rem; color: #1a202c; margin-bottom: 0.5rem; }
        .projects-header p { color: #64748b; font-size: 1.1rem; }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .project-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #e2e8f0;
          height: 180px;
        }
        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          border-color: #3b82f6;
        }

        h3 { color: #1e293b; margin: 0 0 0.5rem; font-size: 1.25rem; }
        .meta { color: #475569; font-size: 0.95rem; margin-bottom: 0.5rem; }
        .date { color: #94a3b8; font-size: 0.8rem; }

        .project-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }
        .edit-link { color: #3b82f6; font-weight: 600; font-size: 0.9rem; }
        .delete-link { 
          background: none; 
          border: none; 
          color: #ef4444; 
          font-size: 0.85rem; 
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .delete-link:hover { opacity: 1; text-decoration: underline; }

        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          background: white;
          border-radius: 20px;
          max-width: 600px;
          margin: 4rem auto;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .empty-icon { font-size: 4rem; margin-bottom: 1.5rem; }
        .empty-state h2 { margin-bottom: 1rem; color: #1e293b; }
        .empty-state p { color: #64748b; margin-bottom: 2rem; }
        .create-btn {
          background: #3b82f6;
          color: white;
          padding: 0.8rem 2rem;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s;
        }
        .create-btn:hover { background: #2563eb; }

        .loading { display: flex; justify-content: center; align-items: center; height: 80vh; color: #64748b; font-size: 1.2rem; }
      `}</style>
        </div>
    );
}
