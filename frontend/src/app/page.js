// s/_app.js
'use client';   // needed because you're using React state/hooks in Next.js app router

import React, { useState } from 'react';


import { LandingPage } from "@/components/LandingPage";
import { LoginPage } from "@/components/auth_pages/LoginPage";
import { SignupPage } from "@/components/SignUpPage";
import {Dashboard} from "@/components/Dashboard";
import { InventoryPage } from "@/components/inventory/InventoryPage";
import { AlertPage } from "@/components/AlertPage";
import { StaffPage } from "@/components/inventory/StaffPage";
import { use } from "react";
import { ca } from 'zod/v4/locales/index.cjs';

export default function App({ Component, pageProps }) {
  const [currentPage, setCurrentPage] = useState("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("landing");
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
