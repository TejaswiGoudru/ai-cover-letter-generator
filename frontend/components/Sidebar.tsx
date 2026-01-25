'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const ProjectsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" /><path d="M8 7h6" /><path d="M8 11h8" /></svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, token } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!token) return null;

  const navItems = [
    { name: 'Generator', href: '/', icon: <HomeIcon /> },
    { name: 'AI Chat', href: '/chat', icon: <ChatIcon /> },
    { name: 'My Projects', href: '/projects', icon: <ProjectsIcon /> },
    { name: 'Profile', href: '/profile', icon: <ProfileIcon /> },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>AI Gen</h2>}
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon />
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            title={collapsed ? item.name : ''}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="label">{item.name}</span>}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-button" title={collapsed ? 'Logout' : ''}>
          <span className="icon"><LogoutIcon /></span>
          {!collapsed && <span className="label">Logout</span>}
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 250px;
          height: 100vh;
          background: #111;
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          transition: width 0.3s ease;
          overflow: hidden;
          z-index: 1000;
        }
        .sidebar.collapsed {
          width: 80px;
        }
        .sidebar-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #222;
          height: 72px;
        }
        .sidebar.collapsed .sidebar-header {
          justify-content: center;
          padding: 1rem;
        }
        h2 { margin: 0; font-size: 1.25rem; color: #0070f3; font-weight: 700; white-space: nowrap; }
        .toggle-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toggle-btn:hover {
          background: #222;
          color: white;
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }
        .nav-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 1.5rem;
          color: #999;
          text-decoration: none;
          transition: all 0.2s;
          gap: 1rem;
        }
        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 1rem;
        }
        .nav-item:hover {
          background: #222;
          color: white;
        }
        .nav-item.active {
          background: #0070f31a;
          color: #0070f3;
          border-right: 3px solid #0070f3;
        }
        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
        }
        .label {
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid #222;
        }
        .sidebar.collapsed .sidebar-footer {
          padding: 1rem;
          display: flex;
          justify-content: center;
        }
        .logout-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1.2rem;
          background: #1a1a1a;
          color: #ff4d4d;
          border: 1px solid #333;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sidebar.collapsed .logout-button {
          width: 48px;
          padding: 0.8rem;
          justify-content: center;
        }
        .logout-button:hover {
          background: #ff4d4d1a;
          border-color: #ff4d4d;
        }
      `}</style>
    </div>
  );
}
