'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import { NAVIGATION_ITEMS } from '../../lib/constants';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="lh-loading-container min-h-screen">
        <div className="lh-spinner lh-spinner-lg" />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-bg-main)' }}
    >
      {/* Mobile sidebar backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black opacity-50" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16 lh-sidebar-collapsed' : 'w-64'} shadow-xl transform lh-transition lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex-col h-screen flex`}
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRight: '1px solid var(--color-border)',
        }}
      >
        {/* Logo and collapse button */}
        <div className="lh-sidebar-header">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="lh-flex-icon-text">
              <div className="lh-icon-circle-primary">
                <span className="font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-semibold lh-title-section">
                Lighthouse
              </span>
            </Link>
          )}

          {sidebarCollapsed && (
            <div className="lh-flex-center w-full">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="lh-flex-center group lh-transition-colors"
                title="Expand sidebar"
              >
                <div className="lh-icon-circle-primary group-hover:shadow-lg lh-transition">
                  <span className="font-bold text-lg">L</span>
                </div>
              </button>
            </div>
          )}

          {/* Collapse button - desktop only */}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lh-desktop-only lh-sidebar-collapse-btn"
            >
              <svg
                className="lh-icon-sm"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7M19 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="lh-sidebar-nav">
          {NAVIGATION_ITEMS.map(item => {
            // Fix active state detection - Overview should only be active when exactly on /dashboard
            const isActive =
              item.name === 'Overview'
                ? pathname === '/dashboard'
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`lh-sidebar-nav-item ${
                  isActive
                    ? 'lh-sidebar-nav-item-active'
                    : 'lh-sidebar-nav-item-inactive'
                }`}
                onClick={handleCloseMobileMenu}
                title={sidebarCollapsed ? item.name : ''}
              >
                {/* Add icons for collapsed state */}
                <div className="flex-shrink-0">
                  {item.name === 'Overview' && (
                    <svg
                      className="lh-icon-md"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                    </svg>
                  )}
                  {item.name === 'Sites' && (
                    <svg
                      className="lh-icon-md"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                      />
                    </svg>
                  )}
                  {item.name === 'Products' && (
                    <svg
                      className="lh-icon-md"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  )}
                  {item.name === 'Billing' && (
                    <svg
                      className="lh-icon-md"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  )}
                  {item.name === 'Diagnostics' && (
                    <svg
                      className="lh-icon-md"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  )}
                  {item.name === 'Insights' && (
                    <svg
                      className="lh-icon-md"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  )}
                </div>
                {!sidebarCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="lh-sidebar-profile">
          {!sidebarCollapsed ? (
            <div className="lh-flex-icon-text">
              <div className="lh-icon-circle-primary w-8 h-8">
                <span className="text-sm font-medium">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="lh-table-cell-content truncate">
                  {user.name || 'User'}
                </p>
                <p className="lh-text-small truncate">{user.email}</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-1 rounded-md lh-transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <svg
                    className="lh-icon-sm"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 lh-dropdown">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        router.push('/dashboard/settings');
                      }}
                      className="lh-dropdown-item"
                    >
                      Account Settings
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="lh-dropdown-item"
                      style={{ color: 'var(--color-text-error)' }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="lh-flex-center">
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="lh-icon-circle-primary w-8 h-8 lh-transition-colors"
                    title={user.name || user.email}
                  >
                    <span className="text-sm font-medium">
                      {user.name
                        ? user.name.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute bottom-full w-48 lh-dropdown"
                      style={{
                        left: 'calc(100% + 0.5rem)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div
                        className="px-4 py-2 border-b"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <p className="lh-table-cell-content truncate">
                          {user.name || 'User'}
                        </p>
                        <p className="lh-text-small truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          router.push('/dashboard/settings');
                        }}
                        className="lh-dropdown-item"
                      >
                        Account Settings
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="lh-dropdown-item"
                        style={{ color: 'var(--color-text-error)' }}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtle expand hint */}
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="group flex items-center justify-center w-8 h-6 rounded-md lh-transition-colors hover:bg-[var(--color-bg-surface)]"
                title="Expand sidebar"
              >
                <svg
                  className="w-4 h-4 lh-transition-transform group-hover:scale-110"
                  style={{ color: 'var(--color-text-muted)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content container */}
      <div
        className={`flex-1 flex flex-col lh-transition ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}
      >
        {/* Mobile top bar */}
        <header
          className="lh-mobile-only shadow-sm border-b h-16 lh-flex-between px-4"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border)',
          }}
        >
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md lh-transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <svg
              className="lh-icon-lg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link href="/dashboard" className="lh-flex-icon-text">
            <div className="lh-icon-circle-primary w-8 h-8">
              <span className="font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-semibold lh-title-section">
              Lighthouse
            </span>
          </Link>
          <div className="w-10" /> {/* Spacer for balance */}
        </header>

        {/* Main content area */}
        <main className="lh-dashboard-main">
          <div className="lh-dashboard-content">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
