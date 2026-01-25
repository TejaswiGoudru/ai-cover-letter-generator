'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your AI Cover Letter Assistant. How can I help you today? You can provide your job description and resume info, or ask me to refine an existing letter.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        router.push('/login');
      }
    } else if (token) {
      fetchProfile();
    }
  }, [token, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [statusMessage, setStatusMessage] = useState('');

  const handleSaveToProject = async (content: string) => {
    setStatusMessage('Saving...');
    try {
      const response = await fetch('http://localhost:4000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `Chat Export - ${new Date().toLocaleDateString()}`,
          companyName: 'Extracted from Chat',
          role: 'Extracted from Chat',
          content: content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')
        })
      });

      if (response.ok) {
        setStatusMessage('Saved to Projects!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage('Failed to save.');
      }
    } catch (err) {
      console.error('Save to project error:', err);
      setStatusMessage('Error saving.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        if (response.status === 401) logout();
        if (response.status === 403) throw new Error('Ultimate tier required');
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setMessages([...updatedMessages, data.message]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages([...updatedMessages, { role: 'assistant', content: error.message === 'Ultimate tier required' ? 'This feature requires an Ultimate subscription. Please upgrade in your profile.' : 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!token || initialLoading) return <div className="loading">Loading...</div>;

  const isUltimate = profile?.subscriptionLevel === 'ultimate';

  return (
    <div className="chat-container">
      {!isUltimate ? (
        <div className="locked-state">
          <div className="lock-card">
            <div className="lock-icon">🔒</div>
            <h2>Ultimate Feature</h2>
            <p>Conversational AI Chat is exclusively available for our <strong>Ultimate</strong> members.</p>
            <p className="sub-text">Upgrade your plan to unlock real-time editing and personalized AI assistance.</p>
            <button onClick={() => router.push('/profile')} className="upgrade-btn">
              Upgrade to Ultimate
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-window">
          <header className="chat-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1>AI Chat Assistant</h1>
                <p>Conversational editing & generation</p>
              </div>
              {statusMessage && <div className="toast-msg">{statusMessage}</div>}
            </div>
          </header>

          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                <div className="bubble-container">
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && index > 0 && (
                    <button
                      className="save-chat-btn"
                      onClick={() => handleSaveToProject(msg.content)}
                      title="Save this cover letter as a project"
                    >
                      💾 Save as Project
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message-wrapper assistant">
                <div className="message-bubble loading">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your requirements or adjustments..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .chat-container {
          padding: 2rem;
          height: 100vh;
          background: #f4f7f6;
          display: flex;
          justify-content: center;
        }
        .chat-window {
          width: 100%;
          max-width: 900px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .chat-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #eee;
          background: white;
        }
        .chat-header h1 { font-size: 1.5rem; margin: 0; color: #333; }
        .chat-header p { font-size: 0.9rem; color: #666; margin: 0.2rem 0 0; }
        
        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: #fafafa;
        }
        
        .message-wrapper {
          display: flex;
          width: 100%;
        }
        .message-wrapper.user { justify-content: flex-end; }
        .message-wrapper.assistant { justify-content: flex-start; }
        
        .message-bubble {
          max-width: 80%;
          padding: 1rem 1.5rem;
          border-radius: 18px;
          font-size: 1rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .user .message-bubble {
          background: #0070f3;
          color: white;
          border-bottom-right-radius: 4px;
        }
        .assistant .message-bubble {
          background: white;
          color: #333;
          border: 1px solid #eee;
          border-bottom-left-radius: 4px;
        }
        
        .chat-input-area {
          padding: 1.5rem 2rem;
          background: white;
          border-top: 1px solid #eee;
          display: flex;
          gap: 1rem;
        }
        input {
          flex: 1;
          padding: 0.8rem 1.2rem;
          border: 1px solid #ddd;
          border-radius: 25px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        input:focus {
          outline: none;
          border-color: #0070f3;
        }
        button {
          padding: 0.8rem 1.8rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover:not(:disabled) { background: #0051bb; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        
        .loading span {
          animation: blink 1.4s infinite both;
          font-size: 1.5rem;
          line-height: 0.5;
        }
        .loading span:nth-child(2) { animation-delay: .2s; }
        .loading span:nth-child(3) { animation-delay: .4s; }
        
        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }

        .locked-state {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }
        .lock-card {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          text-align: center;
          max-width: 450px;
          border: 1px solid #e2e8f0;
        }
        .lock-icon { font-size: 3.5rem; margin-bottom: 1.5rem; }
        .locked-state h2 { font-size: 1.75rem; margin-bottom: 1rem; color: #1a202c; }
        .locked-state p { color: #4a5568; line-height: 1.6; margin-bottom: 0.5rem; }
        .sub-text { font-size: 0.9rem; color: #718096; margin-bottom: 2rem !important; }
        .upgrade-btn {
          background: #6b46c1;
          color: white;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .upgrade-btn:hover { transform: translateY(-2px); background: #553c9a; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; color: #718096; }

        .bubble-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 80%;
        }
        .user .bubble-container { align-items: flex-end; }
        
        .save-chat-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          align-self: flex-start;
          transition: all 0.2s;
        }
        .save-chat-btn:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .toast-msg {
          background: #000;
          color: #fff;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
