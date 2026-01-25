'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/api/login' : '/api/register';
        try {
            const response = await fetch(`http://localhost:4000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (isLogin) {
                login(data.token);
            } else {
                alert('Registration successful! Please login.');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>{isLogin ? 'Login' : 'Register'}</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="primary-button">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <p className="toggle-auth">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Register here' : 'Login here'}
                    </span>
                </p>
            </div>

            <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #f4f7f6;
        }
        .auth-card {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }
        h1 { margin-bottom: 1.5rem; color: #333; text-align: center; }
        .form-group { margin-bottom: 1.2rem; }
        label { display: block; margin-bottom: 0.5rem; color: #666; font-size: 0.9rem; }
        input { 
          width: 100%; 
          padding: 0.8rem; 
          border: 1px solid #ddd; 
          border-radius: 6px; 
          font-size: 1rem;
        }
        .primary-button {
          width: 100%;
          padding: 0.8rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .primary-button:hover { background: #0051bb; }
        .error { color: #d32f2f; background: #ffebee; padding: 0.8rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.9rem; }
        .toggle-auth { margin-top: 1.5rem; text-align: center; color: #666; font-size: 0.9rem; }
        .toggle-auth span { color: #0070f3; cursor: pointer; font-weight: 600; }
        .toggle-auth span:hover { text-decoration: underline; }
      `}</style>
        </div>
    );
}
