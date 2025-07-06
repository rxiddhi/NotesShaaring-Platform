import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer py-12 px-4 md:px-12 mt-12 w-full" style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        {/* Branding and About */}
        <div className="flex-1 flex flex-col items-start gap-3 min-w-[220px]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              {/* Book Icon SVG */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 19V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13"/><path d="M2 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg>
            </div>
            <span className="text-2xl font-bold text-white">NoteNest</span>
          </div>
          <p className="text-gray-300 text-sm max-w-xs leading-relaxed">
            Share Knowledge, Learn Together. NoteNest is a collaborative platform for sharing, discovering, and reviewing study notes and resources. Empower your learning journey with our community!
          </p>
        </div>

        {/* Links */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Home</Link></li>
              <li><Link to="/browse" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Browse Notes</Link></li>
              <li><Link to="/upload" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Upload Notes</Link></li>
              <li><Link to="/doubts" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Doubts</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Login</Link></li>
              <li><Link to="/signup" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Sign Up</Link></li>
              <li><Link to="/forgot-password" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Forgot Password</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-lg">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Terms</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-amber-400 transition-colors duration-200 hover:translate-x-1 inline-block">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-2 border-t border-gray-600 pt-6">
        <span>© {new Date().getFullYear()} NoteNest. All rights reserved.</span>
        <span className="text-amber-400 font-medium">Made for learners everywhere.</span>
      </div>
    </footer>
  );
} 