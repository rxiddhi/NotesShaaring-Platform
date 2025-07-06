import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BookOpen, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings,
  Search,
  Plus,
  MessageCircle,
  Pencil
} from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // You can fetch user data here if needed
    }
  }, []);

  useEffect(() => {
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleAuthChange = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate('/');
    window.dispatchEvent(new Event('authChange'));
  };

  return (
    <nav className="sticky top-0 z-50 theme-transition" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group hover-scale"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">
                NoteNest
              </span>
              <span className="text-xs text-gray-200 -mt-1">Share Knowledge</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/browse" 
              className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 group hover:bg-white/10 px-3 py-2 rounded-lg"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Browse</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/upload" 
                  className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 group hover:bg-white/10 px-3 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Upload</span>
                </Link>
                <Link 
                  to="/doubts" 
                  className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 group hover:bg-white/10 px-3 py-2 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Doubts</span>
                </Link>
                <Link 
                  to="/history" 
                  className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 group hover:bg-white/10 px-3 py-2 rounded-lg"
                >
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Notes</span>
                </Link>
              </>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover-scale group border border-white/20"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors" />
              )}
            </button>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="relative flex items-center space-x-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover-scale border border-white/20"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-white">Account</span>
                </button>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover-scale border border-white/20"
                  aria-label="Edit profile"
                >
                  <Pencil className="w-4 h-4 text-white" />
                </button>
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-lg animate-scale-in">
                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Notes</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
                {/* Edit Profile Modal */}
                {showEditProfile && (
                  <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        setShowEditProfile(false);
                      }
                    }}
                  >
                    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md relative animate-scale-in max-h-[90vh] overflow-y-auto">
                      <button
                        onClick={() => setShowEditProfile(false)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2 pr-8">
                        <Pencil className="w-5 h-5 text-blue-600" /> Edit Profile
                      </h2>
                      {/* Profile edit form placeholder */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-gray-600 text-center">
                          Profile editing coming soon!
                        </div>
                        <button
                          onClick={() => setShowEditProfile(false)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white transition-colors duration-200 font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              <Link
                to="/browse"
                onClick={() => setIsMenuOpen(false)}
                className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <Search className="w-4 h-4" />
                <span>Browse</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/upload"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload</span>
                  </Link>
                  <Link
                    to="/doubts"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Doubts</span>
                  </Link>
                  <Link
                    to="/history"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Notes</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white/90 hover:text-white transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}