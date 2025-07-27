'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/forms/TextField';
import { PasswordField } from '../../../components/forms/PasswordField';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isLoading: contextLoading, error } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Use either context loading or local loading
  const isLoading = contextLoading || localLoading;

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      const { email, password } = formData;
      setLocalLoading(true);
      await login(email, password);
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled by the AuthContext (toast notification)
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="lh-auth-container">
      <div className="lh-auth-content">
        <div className="lh-auth-header">
          <h1 className="lh-title-auth mb-2">Lighthouse</h1>
          <h2 className="lh-title-auth-sub mb-2">Welcome back</h2>
          <p className="lh-text-description">
            Sign in to access your dashboard
          </p>
        </div>

        <Card className="lh-auth-card">
          <CardHeader>
            <h3 className="lh-title-small">Sign in to your account</h3>
          </CardHeader>

          <CardContent>
            {/* Server error display */}
            {error && (
              <div className="mb-6 lh-alert lh-alert-error">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="lh-form">
              <div className="lh-form-section">
                <TextField
                  label="Email address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="you@example.com"
                  required
                />

                <PasswordField
                  label="Password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="lh-text-muted">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="lh-text-link font-medium">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
