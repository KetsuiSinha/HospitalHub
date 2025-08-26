import React from 'react';
import { Button } from './ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-background">
        <div className="text-2xl font-bold text-primary">hospibot</div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="hover:text-primary">Home</a>
          <a href="#features" className="hover:text-primary">Features</a>
          <a href="#about" className="hover:text-primary">About</a>
          <a href="#contact" className="hover:text-primary">Contact</a>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-secondary"
            onClick={() => onNavigate('login')}
          >
            Sign in
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-accent"
            onClick={() => onNavigate('signup')}
          >
            Sign up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-8 py-10 lg:py-20 gap-10">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-foreground">
            Smarter Healthcare with AI-Powered Management
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Manage medicine inventory, real-time alerts for doctors, and staff attendance—all in one minimal dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-accent h-11 px-8"
              onClick={() => onNavigate('signup')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-secondary h-11 px-8"
            >
              Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="flex-1 max-w-lg">
          <div className="bg-card rounded-xl border border-border h-80 flex items-center justify-center shadow-md">
            <div className="text-muted-foreground text-center">
              <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
              <p>Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">Inventory Management</h3>
            <p className="text-muted-foreground">Track stock, expiry, and low-stock alerts.</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">AI Alerts</h3>
            <p className="text-muted-foreground">Location-aware alerts for doctors by event/severity.</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">Staff Management</h3>
            <p className="text-muted-foreground">Daily presence, roles, duty roster overview.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-8 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">About Hospibot</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At Hospibot, our mission is simple — make healthcare smarter and more accessible.  
              By combining AI with hospital management, we help reduce human error, optimize resources,  
              and ensure doctors and staff focus more on patients, not paperwork.
            </p>
            <p className="text-muted-foreground">
              From inventory predictions to smart staff allocation, Hospibot is designed  
              to grow alongside your hospital and improve decision-making at every level.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-card border border-border rounded-2xl shadow-md flex items-center justify-center">
              <span className="text-muted-foreground">[ Illustration / Logo ]</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card p-6 rounded-xl shadow-md border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Recommended Medicines for Next Week</h3>
            <ul className="space-y-2 text-foreground">
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
      <footer id="contact" className="px-8 py-12 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary">hospibot</h3>
            <p className="text-muted-foreground mt-2">
              AI-driven hospital management for a smarter, healthier future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-2">
            <a href="#about" className="text-muted-foreground hover:text-primary">About</a>
            <a href="#features" className="text-muted-foreground hover:text-primary">Features</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a>
          </div>

          {/* Socials */}
          <div className="flex space-x-4 items-center">
            <a href="#" className="text-muted-foreground hover:text-primary"><Github size={20} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          © 2025 Hospibot. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
