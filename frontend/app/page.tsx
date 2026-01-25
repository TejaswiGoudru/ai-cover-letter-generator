'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import CoverLetterForm from '@/components/CoverLetterForm';

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        router.push('/login');
      }
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '12px', background: 'linear-gradient(to right, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Cover Letter Generator
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666' }}>
          Create tailored, professional cover letters in seconds.
        </p>
      </header>

      <section style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <CoverLetterForm />
      </section>

      <footer style={{ marginTop: '80px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} AI Cover Letter Generator. Built with Next.js and Ollama.</p>
      </footer>
    </main>
  );
}
