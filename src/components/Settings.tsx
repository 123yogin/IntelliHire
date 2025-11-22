import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const NOTIF_KEY = 'intellihire_notifications';
const THEME_KEY = 'intellihire_theme';

const defaultNotifs = {
  testAssignments: true,
  testResults: true,
  announcements: true,
};

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [notifications, setNotifications] = useState(defaultNotifs);
  const [theme, setTheme] = useState('light');

  // Load notification and theme preferences from localStorage
  useEffect(() => {
    const notifStr = localStorage.getItem(NOTIF_KEY);
    if (notifStr) setNotifications(JSON.parse(notifStr));
    const themeStr = localStorage.getItem(THEME_KEY);
    if (themeStr) setTheme(themeStr);
  }, []);

  // Save notification preferences
  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(e.target.value);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send update to backend here
    alert('Profile updated! (Demo only, not persisted)');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Account Info */}
      <section className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`}
              alt="Avatar"
              className="w-16 h-16 rounded-full border"
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
              <input
                type="text"
                value={avatar}
                onChange={handleAvatarChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Paste image URL or leave blank for default"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              title="Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              title="Email"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mt-2"
          >
            Update Profile
          </button>
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notifications.testAssignments}
              onChange={e => setNotifications(n => ({ ...n, testAssignments: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Receive email when you are assigned a new test</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notifications.testResults}
              onChange={e => setNotifications(n => ({ ...n, testResults: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Receive email when your test results are published</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notifications.announcements}
              onChange={e => setNotifications(n => ({ ...n, announcements: e.target.checked }))}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Receive platform announcements</span>
          </label>
        </div>
      </section>
    </div>
  );
};

export default Settings; 