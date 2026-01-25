import CoverLetterForm from '@/components/CoverLetterForm';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '12px', background: 'linear-gradient(to right, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Cover Letter Generator
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
          Create tailored, professional cover letters in seconds.
        </p>
      </header>

      <section style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <CoverLetterForm />
      </section>

      <footer style={{ marginTop: '80px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} AI Cover Letter Generator. Built with Next.js and Gemini AI.</p>
      </footer>
    </main>
  );
}
