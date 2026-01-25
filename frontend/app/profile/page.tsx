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
        subscriptionLevel: 'standard',
        billingCycle: 'monthly',
        isTrial: false,
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [tempBillingCycle, setTempBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
                setTempBillingCycle(data.billingCycle || 'monthly');
            } else if (response.status === 401) {
                logout();
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e?: React.FormEvent, updatedFields?: any) => {
        if (e) e.preventDefault();
        setMessage('');
        try {
            const payload = { ...profile, ...updatedFields };
            const response = await fetch('http://localhost:4000/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                setMessage('Profile updated successfully!');
            } else {
                setMessage('Failed to update profile.');
            }
        } catch (err) {
            setMessage('An error occurred.');
        }
    };

    const handlePlanSelect = (level: string) => {
        handleUpdate(undefined, {
            subscriptionLevel: level,
            billingCycle: tempBillingCycle,
            isTrial: false // Reset trial when picking a new plan
        });
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

    const plans = [
        {
            id: 'standard',
            name: 'Standard',
            price: 0,
            features: ['Unlimited basic letters', 'Standard AI models', 'Profile storage']
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 5,
            features: ['Advanced AI models', 'Premium templates', 'Priority support']
        },
        {
            id: 'ultimate',
            name: 'Ultimate',
            price: 10,
            features: ['Conversational AI Chat', 'Custom tone settings', 'Unlimited everything']
        },
    ];

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <div className={`subscription-badge ${profile.subscriptionLevel}`}>
                        {profile.subscriptionLevel.toUpperCase()} {profile.isTrial ? '(TRIAL)' : ''}
                    </div>
                </div>
                {message && <p className="success-message">{message}</p>}

                <section className="profile-section">
                    <h3>Personal Information</h3>
                    <form onSubmit={(e) => handleUpdate(e)}>
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
                        <button type="submit" className="save-button">Save Profile Details</button>
                    </form>
                </section>

                <hr className="divider" />

                <section className="subscription-section">
                    <div className="section-header">
                        <h3>Plan Management</h3>
                        <div className="billing-toggle">
                            <span className={tempBillingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
                            <button
                                className={`toggle-switch ${tempBillingCycle}`}
                                onClick={() => setTempBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            />
                            <span className={tempBillingCycle === 'yearly' ? 'active' : ''}>
                                Yearly <span className="discount-tag">Save 25%</span>
                            </span>
                        </div>
                    </div>

                    <div className="pricing-grid">
                        {plans.map(plan => {
                            const isCurrent = profile.subscriptionLevel === plan.id;
                            const monthlyPrice = plan.price;
                            const yearlyPriceRaw = plan.price * 12;
                            const yearlyPriceDiscounted = yearlyPriceRaw * 0.75;
                            const displayPrice = tempBillingCycle === 'monthly' ? monthlyPrice : (yearlyPriceDiscounted / 12).toFixed(2);

                            return (
                                <div key={plan.id} className={`plan-card ${isCurrent ? 'current' : ''}`}>
                                    <h4>{plan.name}</h4>
                                    <div className="price">
                                        <span className="currency">$</span>
                                        <span className="amount">{displayPrice}</span>
                                        <span className="period">/mo</span>
                                    </div>
                                    {tempBillingCycle === 'yearly' && plan.price > 0 && (
                                        <div className="yearly-total">Billed as ${yearlyPriceDiscounted.toFixed(0)}/yr</div>
                                    )}
                                    <ul className="features">
                                        {plan.features.map(f => <li key={f}>{f}</li>)}
                                    </ul>
                                    {isCurrent ? (
                                        <button className="plan-button current" disabled>Current Plan</button>
                                    ) : (
                                        <button
                                            className="plan-button"
                                            onClick={() => handlePlanSelect(plan.id)}
                                        >
                                            Upgrade to {plan.name}
                                        </button>
                                    )}
                                    {!isCurrent && plan.id !== 'standard' && (
                                        <p className="trial-link" onClick={() => handleUpdate(undefined, { subscriptionLevel: plan.id, isTrial: true })}>
                                            Try for 15 days free
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            <style jsx>{`
        .profile-container {
          padding: 2rem;
          min-height: 100vh;
          background: #f9f9f9;
        }
        .profile-card {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .profile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3rem;
        }
        h1 { margin: 0; font-size: 2rem; color: #1a202c; }
        h3 { font-size: 1.25rem; color: #2d3748; margin-bottom: 1.5rem; }
        .subscription-badge {
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .subscription-badge.standard { background: #edf2f7; color: #4a5568; }
        .subscription-badge.professional { background: #ebf8ff; color: #2b6cb0; border: 1px solid #bee3f8; }
        .subscription-badge.ultimate { background: #faf5ff; color: #6b46c1; border: 1px solid #e9d8fd; box-shadow: 0 0 15px rgba(107, 70, 193, 0.15); }

        .profile-section { margin-bottom: 3rem; }
        .divider { border: none; border-top: 1px solid #edf2f7; margin: 3rem 0; }

        .avatar-preview {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          background: #f7fafc;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 3px solid #edf2f7;
        }
        .avatar-preview img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder-avatar { font-size: 2rem; color: #cbd5e0; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        label { font-size: 0.85rem; color: #718096; font-weight: 600; }
        input[type="text"], input[type="email"] {
          padding: 0.85rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        input:focus { outline: none; border-color: #3182ce; }
        
        .save-button {
          background: #3182ce;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .save-button:hover { background: #2b6cb0; }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .billing-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #718096;
        }
        .billing-toggle span.active { color: #2d3748; }
        .discount-tag {
          background: #c6f6d5;
          color: #22543d;
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 10px;
          margin-left: 0.5rem;
        }
        .toggle-switch {
          width: 44px;
          height: 22px;
          background: #e2e8f0;
          border-radius: 11px;
          position: relative;
          cursor: pointer;
          border: none;
          transition: background 0.3s;
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: left 0.3s;
        }
        .toggle-switch.yearly { background: #3182ce; }
        .toggle-switch.yearly::after { left: 24px; }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .plan-card {
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          text-align: center;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .plan-card.current { border-color: #3182ce; background: #ebf8ff1a; box-shadow: 0 4px 12px rgba(49, 130, 206, 0.1); }
        .plan-card h4 { margin: 0 0 1rem; font-size: 1.1rem; color: #2d3748; }
        .price { margin-bottom: 0.5rem; }
        .amount { font-size: 2.25rem; font-weight: 800; color: #1a202c; }
        .currency, .period { color: #718096; font-weight: 600; }
        .yearly-total { font-size: 0.8rem; color: #38a169; font-weight: 700; margin-bottom: 1rem; }
        .features {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0 2rem;
          text-align: left;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .features li { font-size: 0.9rem; color: #4a5568; display: flex; align-items: center; gap: 0.5rem; }
        .features li::before { content: '✓'; color: #38a169; font-weight: 800; }
        
        .plan-button {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #3182ce;
          background: white;
          color: #3182ce;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .plan-button:hover:not(.current) { background: #3182ce; color: white; }
        .plan-button.current { background: #3182ce; color: white; cursor: default; }
        
        .trial-link { margin-top: 1rem; font-size: 0.8rem; color: #718096; text-decoration: underline; cursor: pointer; }
        .trial-link:hover { color: #3182ce; }

        .success-message { background: #f0fff4; color: #22543d; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #c6f6d5; text-align: center; }
        .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.2rem; color: #718096; }
      `}</style>
        </div>
    );
}
