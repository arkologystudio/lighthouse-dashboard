'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { TextField } from '../../../components/forms/TextField';
import { PasswordField } from '../../../components/forms/PasswordField';
import { STORAGE_KEYS } from '../../../lib/constants';
import toast from 'react-hot-toast';

interface ProfileData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleProfileInputChange =
    (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handlePasswordInputChange =
    (field: keyof PasswordData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        toast.error('You must be logged in to update your profile');
        return;
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name.trim(),
          email: profileData.email.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Profile updated successfully');
        // Update local storage user data
        const userData = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.USER) || '{}'
        );
        const updatedUser = {
          ...userData,
          name: profileData.name.trim(),
          email: profileData.email.trim(),
          updated_at: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    // Validate password strength
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        toast.error('You must be logged in to change your password');
        return;
      }

      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(result.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('An error occurred while updating your password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lh-page-container">
      <div className="lh-page-header">
        <h1 className="lh-title-page">Account Settings</h1>
        <p className="lh-text-description mt-2">
          Manage your account information and security settings
        </p>
      </div>

      <div className="lh-section-container">
        <div className="max-w-2xl">
          {/* Profile Information */}
          <Card className="lh-card mb-8">
            <CardHeader>
              <h2 className="lh-title-section">Profile Information</h2>
              <p className="lh-text-description">
                Update your personal information and contact details
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="lh-form">
                <div className="lh-form-section">
                  <TextField
                    label="Full Name"
                    type="text"
                    value={profileData.name}
                    onChange={handleProfileInputChange('name')}
                    placeholder="Enter your full name"
                    required
                  />

                  <TextField
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileInputChange('email')}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="lh-form-actions">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="lh-card mb-8">
            <CardHeader>
              <h2 className="lh-title-section">Change Password</h2>
              <p className="lh-text-description">
                Update your password to keep your account secure
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="lh-form">
                <div className="lh-form-section">
                  <PasswordField
                    label="Current Password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange('currentPassword')}
                    placeholder="Enter your current password"
                    required
                  />

                  <PasswordField
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange('newPassword')}
                    placeholder="Enter your new password"
                    helperText="Password must be at least 8 characters long"
                    required
                  />

                  <PasswordField
                    label="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange('confirmPassword')}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                <div className="lh-form-actions">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="lh-card">
            <CardHeader>
              <h2 className="lh-title-section">Account Information</h2>
              <p className="lh-text-description">
                Your account details and subscription information
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className="lh-flex-between py-3 border-b"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <span className="lh-table-cell-meta">Account ID</span>
                  <span className="lh-table-cell-content font-mono text-sm">
                    {user?.id || 'Loading...'}
                  </span>
                </div>
                <div
                  className="lh-flex-between py-3 border-b"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <span className="lh-table-cell-meta">Member Since</span>
                  <span className="lh-table-cell-content">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Loading...'}
                  </span>
                </div>
                <div
                  className="lh-flex-between py-3 border-b"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <span className="lh-table-cell-meta">Account Status</span>
                  <span className="lh-badge lh-badge-green">Active</span>
                </div>
                <div className="lh-flex-between py-3">
                  <span className="lh-table-cell-meta">Subscription Tier</span>
                  <span className="lh-badge lh-badge-blue">
                    {user?.subscription_tier || 'Free'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
