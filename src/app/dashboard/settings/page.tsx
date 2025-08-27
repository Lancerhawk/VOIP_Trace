'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Database, Key, Clock, AlertCircle } from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState<UserProfile>({
    id: 0,
    username: '',
    email: '',
    emailVerified: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setProfileData({
            id: data.user.id,
            username: data.user.username || '',
            email: data.user.email || '',
            emailVerified: data.user.email_verified === true
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      // Here you would typically make an API call to update the profile
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'System', icon: Database }
  ];

  if (isLoading) {
    return (
      <div className="p-8 max-w-8xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-8xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and system preferences</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    profileData.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profileData.emailVerified ? 'Email Verified' : 'Email Not Verified'}
                  </span>
                  {!profileData.emailVerified && (
                    <button
                      onClick={() => alert('Email verification feature coming soon!')}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                    >
                      Verify Email
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter your username"
                  />
                  <p className="text-xs text-gray-500 mt-1">This is your display name in the system</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Enter your email address"
                  />
                  <p className="text-xs text-gray-500 mt-1">Used for login and notifications</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <p className="text-xs text-gray-500 mt-2">Changes will be applied immediately</p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Features Coming Soon</h3>
                <p className="text-gray-600 mb-6">Advanced security features are currently in development</p>
                <div className="space-y-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Two-Factor Authentication</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Key className="w-4 h-4" />
                    <span>Password Management</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Login History & Alerts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Preferences Coming Soon</h3>
                <p className="text-gray-600 mb-6">Customize your notification settings</p>
                <div className="space-y-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Suspicious Activity Alerts</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>System Updates</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Database className="w-4 h-4" />
                    <span>Analysis Reports</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">System Configuration Coming Soon</h3>
                <p className="text-gray-600 mb-6">Advanced system settings and preferences</p>
                <div className="space-y-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Data Retention Policies</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Detection Sensitivity</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Database className="w-4 h-4" />
                    <span>Auto-Export Settings</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
