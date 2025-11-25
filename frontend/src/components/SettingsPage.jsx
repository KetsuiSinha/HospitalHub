import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Moon, Sun, Laptop } from 'lucide-react';
import '@/app/globals.css'; // import global theme
import { getAuthUser } from '@/lib/api';

export function SettingsPage() {
  const [user, setUser] = useState(() => getAuthUser() || { name: '—', email: '—' });

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme') || 'default';
    }
    return 'default';
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription>
              View your personal details and account status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Full Name</Label>
                <div className="flex items-center p-3 rounded-md bg-muted/50 border border-border">
                  <User className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">{user.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Email Address</Label>
                <div className="flex items-center p-3 rounded-md bg-muted/50 border border-border">
                  <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">{user.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how Hospibot looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">
                      <div className="flex items-center">
                        <Laptop className="w-4 h-4 mr-2" />
                        System Default
                      </div>
                    </SelectItem>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 mr-2" />
                        Light Mode
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="w-4 h-4 mr-2" />
                        Dark Mode
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Select your preferred theme. System default will match your device settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
