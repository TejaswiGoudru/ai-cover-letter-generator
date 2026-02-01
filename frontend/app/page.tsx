'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ projects: 0, resumes: 0, letters: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    { src: '/images/hero1.png', title: 'Craft Your Future', subtitle: 'AI-powered documents that get you hired.' },
    { src: '/images/hero2.png', title: 'Land Your Dream Job', subtitle: 'Tailored applications for every opportunity.' },
    { src: '/images/hero3.png', title: 'AI-Driven Excellence', subtitle: 'Smart career tools at your fingertips.' }
  ];

  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        router.push('/login');
      }
    } else if (token) {
      fetchStats();
    }
  }, [token, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const resumes = data.filter((p: any) => p.projectType === 'resume').length;
        const letters = data.filter((p: any) => p.projectType === 'cover_letter').length;
        setStats({ projects: data.length, resumes, letters });
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  if (!token) return null;

  const features = [
    {
      title: 'Cover Letter Generator',
      desc: 'Create highly tailored cover letters for any job description.',
      link: '/cover-generator',
      icon: '✍️',
      color: '#3b82f6'
    },
    {
      title: 'Resume Builder',
      desc: 'Build multiple versions of your professional resume with AI.',
      link: '/resume-builder',
      icon: '📄',
      color: '#10b981'
    },
    {
      title: 'AI Chat Assistant',
      desc: 'Refine your documents or ask for career advice in real-time.',
      link: '/chat',
      icon: '💬',
      color: '#8b5cf6'
    },
    {
      title: 'Project Library',
      desc: 'Manage and edit all your saved resumes and cover letters.',
      link: '/projects',
      icon: '📂',
      color: '#f59e0b'
    }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome">
          <h1>Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!</h1>
          <p>What would you like to build today?</p>
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{stats.resumes}</span>
            <span className="stat-label">Resumes</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.letters}</span>
            <span className="stat-label">Letters</span>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="carousel-container">
          {heroImages.map((image, idx) => (
            <div key={idx} className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}>
              <img src={image.src} alt={image.title} />
              <div className="slide-content">
                <h2>{image.title}</h2>
                <p>{image.subtitle}</p>
              </div>
            </div>
          ))}
          <div className="carousel-dots">
            {heroImages.map((_, idx) => (
              <div key={idx} className={`dot ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)} />
            ))}
          </div>
        </div>
      </section>

      <div className="features-grid">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.link} className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: feature.color + '20', color: feature.color }}>
              {feature.icon}
            </div>
            <div className="feature-info">
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
            <div className="feature-arrow">→</div>
          </Link>
        ))}
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-logo">AI Cover Letter Gen</div>
          <nav className="footer-links">
            <Link href="/cover-generator">Generator</Link>
            <Link href="/resume-builder">Resume Builder</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/profile">Profile</Link>
          </nav>
          <p className="copyright">© {new Date().getFullYear()} AI Cover Letter Generator. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
                .dashboard-container {
                    padding: 4rem 2rem 0;
                    max-width: 1200px;
                    margin: 0 auto;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 3rem;
                }
                h1 { font-size: 2.75rem; color: #1e293b; margin-bottom: 0.5rem; font-weight: 800; }
                .welcome p { color: #64748b; font-size: 1.2rem; }

                .stats-row { display: flex; gap: 2rem; }
                .stat-card {
                    background: white;
                    padding: 1rem 2rem;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 120px;
                    border: 1px solid #f1f5f9;
                }
                .stat-value { font-size: 1.75rem; font-weight: 800; color: #3b82f6; }
                .stat-label { font-size: 0.85rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }

                .hero-section {
                    margin-bottom: 4rem;
                    height: 400px;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                    position: relative;
                }
                .carousel-container {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                .carousel-slide {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    transition: opacity 1s ease-in-out;
                    z-index: 1;
                }
                .carousel-slide.active {
                    opacity: 1;
                    z-index: 2;
                }
                .carousel-slide img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .carousel-slide::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%);
                }
                .slide-content {
                    position: absolute;
                    bottom: 4rem;
                    left: 4rem;
                    color: white;
                    z-index: 3;
                    max-width: 500px;
                }
                .slide-content h2 { font-size: 3rem; font-weight: 800; margin-bottom: 1rem; }
                .slide-content p { font-size: 1.25rem; opacity: 0.9; }

                .carousel-dots {
                    position: absolute;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 0.75rem;
                    z-index: 4;
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.3);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .dot.active { background: white; width: 30px; border-radius: 10px; }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                    margin-bottom: 6rem;
                    flex: 1;
                }

                .feature-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 20px;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #e2e8f0;
                    position: relative;
                }
                .feature-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                    border-color: #3b82f6;
                }

                .feature-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                h3 { font-size: 1.25rem; color: #1e293b; margin-bottom: 0.75rem; font-weight: 700; }
                .feature-info p { color: #64748b; line-height: 1.6; font-size: 0.95rem; }

                .feature-arrow {
                    position: absolute;
                    bottom: 2rem;
                    right: 2rem;
                    color: #cbd5e1;
                    font-size: 1.25rem;
                    transition: transform 0.2s;
                }
                .feature-card:hover .feature-arrow {
                    color: #3b82f6;
                    transform: translateX(5px);
                }

                .dashboard-footer {
                    margin-top: auto;
                    padding: 4rem 0 2rem;
                    border-top: 1px solid #e2e8f0;
                }
                .footer-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                }
                .footer-logo { font-size: 1.5rem; font-weight: 800; color: #1e293b; }
                .footer-links { display: flex; gap: 3rem; }
                .footer-links :global(a) { color: #64748b; text-decoration: none; font-weight: 500; transition: color 0.2s; }
                .footer-links :global(a:hover) { color: #3b82f6; }
                .copyright { color: #94a3b8; font-size: 0.85rem; }

                @media (max-width: 768px) {
                    .dashboard-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
                    .hero-section { height: 300px; }
                    .slide-content { bottom: 2rem; left: 2rem; right: 2rem; }
                    .slide-content h2 { font-size: 2rem; }
                    .footer-links { flex-direction: column; align-items: center; gap: 1rem; }
                }
            `}</style>
    </div>
  );
}
