'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';

export default function ProfilePage() {
    const { token, logout } = useAuth();
    const [profile, setProfile] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        profileEmail: '',
        profilePicture: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else if (response.status === 401) {
                logout();
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:4000/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profile),
            });
            if (response.ok) {
                setMessage('Profile updated successfully!');
            } else {
                setMessage('Failed to update profile.');
            }
        } catch (err) {
            setMessage('An error occurred.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, profilePicture: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1>My Profile</h1>
                {message && <p className="success-message">{message}</p>}
                <form onSubmit={handleUpdate}>
                    <div className="profile-picture-section">
                        <div className="avatar-preview">
                            {profile.profilePicture ? (
                                <img src={profile.profilePicture} alt="Avatar" />
                            ) : (
                                <div className="placeholder-avatar">Initial</div>
                            )}
                        </div>
                        <input type="file" onChange={handleFileChange} accept="image/*" />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={profile.firstName}
                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Middle Name</label>
                            <input
                                type="text"
                                value={profile.middleName}
                                onChange={(e) => setProfile({ ...profile, middleName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={profile.lastName}
                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Profile Email (External)</label>
                            <input
                                type="email"
                                value={profile.profileEmail}
                                onChange={(e) => setProfile({ ...profile, profileEmail: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="save-button">Save Changes</button>
                </form>
            </div>

            <style jsx>{`
        .profile-container {
          padding: 2rem;
          margin-left: 250px;
          min-height: 100vh;
          background: #f9f9f9;
        }
        .profile-card {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        h1 { margin-bottom: 2rem; color: #333; }
        .profile-picture-section {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }
        .avatar-preview {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          background: #eee;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder-avatar { font-size: 2rem; color: #aaa; }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        label { font-size: 0.9rem; color: #666; font-weight: 500; }
        input[type="text"], input[type="email"] {
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        .save-button {
          background: #0070f3;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .save-button:hover { background: #0051bb; }
        .success-message { background: #e6fffa; color: #2d3748; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; border: 1px solid #b2f5ea; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.2rem; color: #666; }
      `}</style>
        </div>
    );
}
