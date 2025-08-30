// s/_app.js
'use client';   // needed because you're using React state/hooks in Next.js app router

import React, { useEffect, useState } from 'react';


import { LandingPage } from "@/components/LandingPage";
import { LoginPage } from "@/components/auth_pages/LoginPage";
import { SignupPage } from "@/components/SignUpPage";
import { Dashboard } from "@/components/Dashboard";
import { InventoryPage } from "@/components/inventory/InventoryPage";
import { AlertPage } from "@/components/AlertPage";
import { StaffPage } from "@/components/inventory/StaffPage";
import { SettingsPage } from '@/components/SettingsPage';
import { getAuthUser, clearAuth } from "@/lib/api";

export default function App({ Component, pageProps }) {
  const [currentPage, setCurrentPage] = useState("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    const savedPage = typeof window !== 'undefined' ? localStorage.getItem('current_page') : null;
    if (user) {
      setIsAuthenticated(true);
      if (savedPage) setCurrentPage(savedPage);
    } else {
      // If not authenticated, only allow public pages on refresh
      const publicPages = new Set(["landing", "login", "signup"]);
      setCurrentPage(publicPages.has(savedPage || "") ? savedPage : "landing");
    }
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_page', page);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_page', 'dashboard');
    }
  };

  const handleLogout = () => {
    clearAuth();
    setIsAuthenticated(false);
    setCurrentPage("landing");
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current_page');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={navigate} />;
      case "login":
        return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
      case "signup":
        return <SignupPage onNavigate={navigate} onLogin={handleLogin} />;
      case "dashboard":
        return <Dashboard onNavigate={navigate} onLogout={handleLogout} />;
      case "inventory":
        return <InventoryPage onNavigate={navigate} onLogout={handleLogout} />;
      case "alerts":
        return <AlertPage onNavigate={navigate} onLogout={handleLogout} />;
      case "staff":
        return <StaffPage onNavigate={navigate} onLogout={handleLogout} />;
      case "settings":
        return <SettingsPage onNavigate={navigate} onLogout={handleLogout} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}
