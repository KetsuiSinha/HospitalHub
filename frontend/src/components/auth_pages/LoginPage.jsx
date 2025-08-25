import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to Hospibot</h1>
          <p className="text-gray-600">Welcome back to your healthcare dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <a href="#" className="text-blue-700 hover:text-blue-800">Forgot password?</a>
          <span className="mx-2">•</span>
          <button 
            onClick={() => onNavigate('signup')}
            className="text-blue-700 hover:text-blue-800"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
