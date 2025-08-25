import React from 'react';
import { Button } from './ui/button';

export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-50">
        <div className="text-2xl font-bold text-blue-700">hospibot</div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-900 hover:text-blue-700">Home</a>
          <a href="#" className="text-gray-900 hover:text-blue-700">Features</a>
          <a href="#" className="text-gray-900 hover:text-blue-700">About</a>
          <a href="#" className="text-gray-900 hover:text-blue-700">Contact</a>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-blue-700 text-blue-700 hover:bg-blue-50"
            onClick={() => onNavigate('login')}
          >
            Sign in
          </Button>
          <Button 
            className="bg-blue-700 hover:bg-blue-800"
            onClick={() => onNavigate('signup')}
          >
            Sign up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-8 py-10 lg:py-20 gap-10">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Smarter Healthcare with AI-Powered Management
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Manage medicine inventory, real-time alerts for doctors, and staff attendance—all in one minimal dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="bg-blue-700 hover:bg-blue-800 h-11 px-8"
              onClick={() => onNavigate('signup')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-700 text-blue-700 hover:bg-blue-50 h-11 px-8"
            >
              Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="flex-1 max-w-lg">
          <div className="bg-white rounded-3xl border border-gray-200 h-80 flex items-center justify-center shadow-sm">
            <div className="text-gray-400 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4"></div>
              <p>Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Inventory Management</h3>
            <p className="text-gray-600">Track stock, expiry, and low-stock alerts.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">AI Alerts</h3>
            <p className="text-gray-600">Location-aware alerts for doctors by event/severity.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Staff Management</h3>
            <p className="text-gray-600">Daily presence, roles, duty roster overview.</p>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Medicines for Next Week</h3>
            <ul className="space-y-2 text-gray-900">
              <li>• Paracetamol 500mg</li>
              <li>• Amoxicillin 250mg</li>
              <li>• ORS Sachets</li>
              <li>• Vitamin D3 60k IU</li>
              <li>• Metformin 500mg</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">© 2025 Hospibot. All rights reserved.</p>
          <p className="text-gray-600">Privacy • Terms • Contact</p>
        </div>
      </footer>
    </div>
  );
}
