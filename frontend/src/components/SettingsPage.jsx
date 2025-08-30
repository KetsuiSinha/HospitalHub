import React, { useState, useEffect } from 'react';
import { ToggleableSidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, LogOut } from 'lucide-react';
import '@/app/globals.css'; // import global theme
import { getAuthUser } from '@/lib/api';

export function SettingsPage({ onNavigate, onLogout }) {
  const [user, setUser] = useState(() => getAuthUser() || { name: '—', email: '—' });

  // inside SettingsPage.jsx
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('default', 'light', 'dark');

    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.add('light');
    else root.classList.add('default');

    // persist theme
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    const u = getAuthUser();
    if (u) setUser(u);
  }, []);

  return (
    <ToggleableSidebar currentPage="settings" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Info */}
          <div className="bg-card p-6 rounded-2xl shadow border border-border space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Account Information</h2>
            <div className="flex items-center space-x-4">
              <User className="w-6 h-6 text-foreground" />
              <div>
                <Label>Name</Label>
                <p className="font-medium text-gray-700">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-foreground" />
              <div>
                <Label>Email</Label>
                <p className="font-medium text-gray-700">{user.email}</p>
              </div>
            </div>

            <Button
              onClick={onLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          {/* Theme Selector */}
          <div className="bg-card p-6 rounded-2xl shadow border border-border space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Appearance</h2>
            <div className="flex flex-col space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </ToggleableSidebar>
  );
}
