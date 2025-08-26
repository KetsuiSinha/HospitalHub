import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div
        className="p-8 rounded-3xl border w-full max-w-md"
        style={{
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Sign in to Hospibot
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Welcome back to your healthcare dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" style={{ color: 'var(--foreground)' }}>Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              placeholder="Enter your email"
              required
              style={{
                backgroundColor: 'var(--input)',
                color: 'var(--foreground)',
                borderColor: 'var(--border)',
              }}
            />
          </div>

          <div>
            <Label htmlFor="password" style={{ color: 'var(--foreground)' }}>Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="Enter your password"
              required
              style={{
                backgroundColor: 'var(--input)',
                color: 'var(--foreground)',
                borderColor: 'var(--border)',
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: 'var(--radius)',
            }}
          >
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
          <a
            href="#"
            style={{ color: 'var(--primary)' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary)'}
          >
            Forgot password?
          </a>
          <span className="mx-2">•</span>
          <button
            onClick={() => onNavigate('signup')}
            style={{ color: 'var(--primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary)'}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
