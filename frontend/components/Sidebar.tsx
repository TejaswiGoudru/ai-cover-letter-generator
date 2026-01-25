'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { logout, token } = useAuth();

    if (!token) return null;

    const navItems = [
        { name: 'Cover Letter Generator', href: '/' },
        { name: 'My Profile', href: '/profile' },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>AI Gen</h2>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button onClick={logout} className="logout-button">Logout</button>
            </div>

            <style jsx>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          background: #1a1a1a;
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
        }
        .sidebar-header {
          padding: 2rem;
          border-bottom: 1px solid #333;
        }
        h2 { margin: 0; font-size: 1.5rem; color: #0070f3; }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }
        .nav-item {
          display: block;
          padding: 1rem 2rem;
          color: #ccc;
          text-decoration: none;
          transition: all 0.2s;
        }
        .nav-item:hover {
          background: #333;
          color: white;
        }
        .nav-item.active {
          background: #0070f3;
          color: white;
        }
        .sidebar-footer {
          padding: 2rem;
          border-top: 1px solid #333;
        }
        .logout-button {
          width: 100%;
          padding: 0.8rem;
          background: transparent;
          color: #ff4d4d;
          border: 1px solid #ff4d4d;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .logout-button:hover {
          background: #ff4d4d;
          color: white;
        }
      `}</style>
        </div>
    );
}
