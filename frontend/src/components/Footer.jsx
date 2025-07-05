import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer bg-card border-t border-border py-8 px-4 md:px-12 mt-12 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        {/* Branding and About */}
        <div className="flex-1 flex flex-col items-start gap-3 min-w-[220px]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              {/* Book Icon SVG */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 19V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13"/><path d="M2 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg>
            </div>
            <span className="text-2xl font-bold text-primary">NoteNest</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            Share Knowledge, Learn Together. NoteNest is a collaborative platform for sharing, discovering, and reviewing study notes and resources. Empower your learning journey with our community!
          </p>
        </div>

        {/* Links */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Explore</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/browse" className="hover:text-primary transition-colors">Browse Notes</Link></li>
              <li><Link to="/upload" className="hover:text-primary transition-colors">Upload Notes</Link></li>
              <li><Link to="/doubts" className="hover:text-primary transition-colors">Doubts</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Account</h4>
            <ul className="space-y-1">
              <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
              <li><Link to="/forgot-password" className="hover:text-primary transition-colors">Forgot Password</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Legal</h4>
            <ul className="space-y-1">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-2 border-t border-border pt-4">
        <span>© {new Date().getFullYear()} NoteNest. All rights reserved.</span>
        <span>Made for learners everywhere.</span>
      </div>
    </footer>
  );
} 