import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setSuccess('Login successful! Redirecting...');
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative max-w-md w-full space-y-8 animate-slide-up">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-3 mb-8 group hover-scale">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-chart-2 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">
                NoteNest
              </span>
            </div>
          </Link>
          
          <div className="inline-flex items-center space-x-2 bg-accent/50 dark:bg-accent/20 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h2>
          <p className="text-muted-foreground">
            Sign in to your account to continue learning
          </p>
        </div>

        {/* Form */}
        <div className="card-interactive p-8">
          {/* Show message if redirected from protected route */}
          {location.state?.fromProtected && (
            <div className="flex items-center space-x-3 p-4 bg-accent-light/20 border border-accent/30 rounded-lg animate-scale-in mb-4">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-sm text-accent">Please log in to access this page.</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center space-x-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-scale-in">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-scale-in">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-primary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 hover-scale btn-animated disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="loading"></div>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-8">
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:3000/api/auth/google-login'}
                className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-lg bg-background hover:bg-accent transition-all duration-200 font-medium text-foreground"
              >
                <span className="text-base font-semibold">Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
