import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Download, 
  Star, 
  Calendar, 
  User, 
  BookOpen, 
  TrendingUp, 
  Plus,
  Eye,
  MessageCircle,
  Settings,
  ArrowRight,
  Loader,
  AlertCircle,
  Pencil,
  X,
  Heart
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchFavorites();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view dashboard');
        return;
      }

      // Fetch dashboard stats
      const statsResponse = await fetch(`${API_BASE_URL}/auth/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent notes
      const notesResponse = await fetch(`${API_BASE_URL}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (notesResponse.ok) {
        const notesData = await notesResponse.json();
        setRecentNotes(notesData.notes?.slice(0, 5) || []);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:3000/api/notes/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card-interactive p-8 text-center max-w-md animate-scale-in">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up flex items-center gap-4">
          {/* Avatar and Pencil */}
          <div className="relative flex items-center">
            {stats?.user?.imageUrl ? (
              <img
                src={stats.user.imageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center border-2 border-primary shadow">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <button
              onClick={() => setShowEditProfile(true)}
              className="absolute bottom-0 right-0 p-2 bg-background border border-border rounded-full shadow hover:bg-accent transition-colors"
              aria-label="Edit profile"
              style={{ transform: 'translate(25%, 25%)' }}
            >
              <Pencil className="w-4 h-4 text-primary" />
            </button>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-1">
              Welcome back, {stats?.user?.username || 'User'}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Here's what's happening with your notes and activity
            </p>
          </div>
        </div>

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
            <div className="bg-card p-8 rounded-xl shadow-xl w-full max-w-md relative animate-scale-in max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowEditProfile(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2 pr-8">
                <Pencil className="w-5 h-5 text-primary" /> Edit Profile
              </h2>
              {/* Profile edit form placeholder */}
              <div className="space-y-4">
                <div className="bg-accent p-4 rounded-lg text-muted-foreground text-center">
                  Profile editing coming soon!
                </div>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="w-full bg-gradient-primary text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Card */}
        <div className="mb-8 animate-slide-up">
          <div className="card-interactive p-6">
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold text-foreground">Favorites</h2>
            </div>
            {favorites.length === 0 ? (
              <p className="text-muted-foreground">You have no favorite notes yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map(note => (
                  <div key={note._id} className="bg-accent rounded-lg p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{note.title}</span>
                      <span className="text-xs text-muted-foreground">{note.subject}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{note.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>By: {note.uploadedBy?.username || 'Anonymous'}</span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link to={`/notes/${note._id}`} className="text-primary hover:underline text-sm">View</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-interactive p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {stats?.stats?.uploadedNotes || 0}
            </h3>
            <p className="text-muted-foreground text-sm">Notes Uploaded</p>
            <p className="text-xs text-green-500 mt-1">
              +{stats?.stats?.uploadedThisMonth || 0} this month
            </p>
          </div>

          <div className="card-interactive p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-green-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {stats?.stats?.downloadedNotes || 0}
            </h3>
            <p className="text-muted-foreground text-sm">Notes Downloaded</p>
            <p className="text-xs text-green-500 mt-1">
              +{stats?.stats?.downloadedThisMonth || 0} this month
            </p>
          </div>

          <div className="card-interactive p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {stats?.stats?.reviewsReceived || 0}
            </h3>
            <p className="text-muted-foreground text-sm">Reviews Received</p>
            <p className="text-xs text-green-500 mt-1">
              +{stats?.stats?.reviewsThisMonth || 0} this month
            </p>
          </div>

          <div className="card-interactive p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {stats?.stats?.averageRating > 0
                ? stats.stats.averageRating.toFixed(1)
                : 'No ratings yet'}
            </h3>
            <p className="text-muted-foreground text-sm">Average Rating</p>
            <p className="text-xs text-green-500 mt-1">out of 5 stars</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/upload" 
            className="card-interactive p-6 group hover-lift animate-slide-up"
            style={{ animationDelay: '500ms' }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Upload Notes</h3>
                <p className="text-muted-foreground text-sm">Share your knowledge with the community</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link 
            to="/browse" 
            className="card-interactive p-6 group hover-lift animate-slide-up"
            style={{ animationDelay: '600ms' }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Browse Notes</h3>
                <p className="text-muted-foreground text-sm">Discover study materials from others</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link 
            to="/doubts" 
            className="card-interactive p-6 group hover-lift animate-slide-up"
            style={{ animationDelay: '700ms' }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Ask Doubts</h3>
                <p className="text-muted-foreground text-sm">Get help from the community</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Recent Notes */}
        <div className="animate-slide-up" style={{ animationDelay: '800ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Notes</h2>
            <Link 
              to="/browse" 
              className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentNotes.length === 0 ? (
            <div className="card-interactive p-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">No notes yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by uploading your first note or browsing the community
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/upload"
                  className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
                >
                  Upload Note
                </Link>
                <Link
                  to="/browse"
                  className="border-2 border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent transition-all duration-200 hover-scale"
                >
                  Browse Notes
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentNotes.map((note) => (
                <div key={note._id} className="card-interactive p-6 group hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                      {note.subject}
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Download className="w-3 h-3" />
                      <span>{note.downloadCount || 0}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>

                  {note.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {note.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3" />
                      <span>{note.uploadedBy?.username || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>

                  <Link
                    to={`/notes/${note._id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-border rounded-lg text-foreground hover:bg-accent transition-all duration-200 hover-scale"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
