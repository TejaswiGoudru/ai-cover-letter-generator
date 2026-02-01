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

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const ProjectsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" /><path d="M8 7h6" /><path d="M8 11h8" /></svg>
);

const ResumeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
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
    { name: 'Dashboard', href: '/', icon: <HomeIcon /> },
    { name: 'Cover Generator', href: '/cover-generator', icon: <EditIcon /> },
    { name: 'AI Chat', href: '/chat', icon: <ChatIcon /> },
    { name: 'Resume Builder', href: '/resume-builder', icon: <ResumeIcon /> },
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
          background: #ffffff;
          color: #1e293b;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          transition: width 0.3s ease;
          overflow: hidden;
          z-index: 1000;
          border-right: 1px solid #e2e8f0;
        }
        .sidebar.collapsed {
          width: 80px;
        }
        .sidebar-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          height: 72px;
        }
        .sidebar.collapsed .sidebar-header {
          justify-content: center;
          padding: 1rem;
        }
        h2 { margin: 0; font-size: 1.25rem; color: #3b82f6; font-weight: 800; white-space: nowrap; }
        .toggle-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toggle-btn:hover {
          background: #f8fafc;
          color: #3b82f6;
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }
        .nav-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 1.5rem;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
          gap: 1rem;
          font-weight: 600;
        }
        .sidebar.collapsed .nav-item {
          justify-content: center;
          padding: 1rem;
        }
        .nav-item:hover {
          background: #f1f5f9;
          color: #3b82f6;
        }
        .nav-item.active {
          background: #eff6ff;
          color: #3b82f6;
          border-right: 3px solid #3b82f6;
        }
        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          opacity: 0.8;
        }
        .active .icon { opacity: 1; }
        .label {
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid #f1f5f9;
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
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid #fee2e2;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 700;
        }
        .sidebar.collapsed .logout-button {
          width: 48px;
          padding: 0.8rem;
          justify-content: center;
        }
        .logout-button:hover {
          background: #fee2e2;
          border-color: #fecaca;
        }
      `}</style>
    </div>
  );
}
