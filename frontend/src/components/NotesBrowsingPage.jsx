import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Download,
  Eye,
  Search,
  Calendar,
  User,
  BookOpen,
  Heart,
  Filter,
  SortAsc,
  Star,
  Share2,
  AlertCircle,
  Loader,
  Edit,
  Trash2
} from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

const subjects = [
  'All Subjects',
  'General',
  'DSA',
  'WAP',
  'ADA',
  'Maths',
  'PSP',
  'IKS',
  'Physics',
  'English',
  'Others'
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'title', label: 'Title A-Z' }
];

const NotesBrowsingPage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchNotes();
    fetchFavorites();
    fetchCurrentUser();
  }, [searchTerm, selectedSubject, sortBy, currentPage]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_BASE_URL}/notes`);
      const allNotesFetched = response.data.notes || [];
      setAllNotes(allNotesFetched);
      
      // Client-side filtering and sorting
      let filteredNotes = allNotesFetched;
      
      // Filter by search term
      if (searchTerm) {
        filteredNotes = filteredNotes.filter(note => 
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by subject
      if (selectedSubject !== 'All Subjects') {
        filteredNotes = filteredNotes.filter(note => 
          note.subject === selectedSubject
        );
      }
      
      // Sort notes
      filteredNotes.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'downloads':
            return (b.downloadCount || 0) - (a.downloadCount || 0);
          case 'likes':
            return (b.likes || 0) - (a.likes || 0);
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
      
      setNotes(filteredNotes);
      setTotalPages(1); // No pagination for now
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/notes/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data.map(note => note._id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleDownload = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to download notes');
        return;
      }

      // First, track the download
      await axios.put(`${API_BASE_URL}/notes/${noteId}/download`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Then download the file using the authenticated route
      const note = notes.find(n => n._id === noteId);
      if (note) {
        const downloadUrl = `${API_BASE_URL}/notes/${noteId}/download-file`;
        
        // Fetch the file with authorization header
        const response = await fetch(downloadUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          // Create blob from response
          const blob = await response.blob();
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${note.title || 'note'}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          // Clean up the blob URL
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error('Failed to download file');
        }
      }

      // Refresh notes to update download count
      fetchNotes();
    } catch (error) {
      console.error('Error downloading note:', error);
      alert('Failed to download note');
    }
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete notes');
        return;
      }

      await axios.delete(`${API_BASE_URL}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove from local state
      setNotes(prev => prev.filter(note => note._id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const handleFavorite = async (noteId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to favorite notes');
      return;
    }
    const isFavorited = favorites.includes(noteId);
    try {
      let response;
      if (isFavorited) {
        response = await axios.delete(`${API_BASE_URL}/notes/${noteId}/favorite`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        response = await axios.post(`${API_BASE_URL}/notes/${noteId}/favorite`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      if (response.status === 200) {
        setFavorites(prev =>
          isFavorited
            ? prev.filter(id => id !== noteId)
            : [...prev, noteId]
        );
      } else {
        alert('Failed to update favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOwner = (note) => {
    if (!currentUser || !note.uploadedBy) return false;
    const userId = typeof note.uploadedBy === 'object' ? note.uploadedBy._id : note.uploadedBy;
    return userId?.toString() === (currentUser.userId || currentUser._id)?.toString();
  };

  if (loading && notes.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error && notes.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card-interactive p-8 text-center max-w-md animate-scale-in">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Error Loading Notes</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={fetchNotes}
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
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Browse Notes
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover and download high-quality study materials from the community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card-interactive p-6 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                <select
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-8 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                >
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div className="relative group">
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-8 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <p className="mb-6 text-muted-foreground text-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
          Showing {notes.length} of {allNotes.length} notes
        </p>

        {notes.length === 0 ? (
          <div className="card-interactive p-12 text-center animate-slide-up" style={{ animationDelay: '300ms' }}>
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No notes found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedSubject !== 'All Subjects'
                ? 'Try adjusting your search or filters'
                : 'No notes have been uploaded yet. Be the first to share!'
              }
            </p>
            {!searchTerm && selectedSubject === 'All Subjects' && (
              <button
                onClick={() => navigate('/upload')}
                className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
              >
                Upload First Note
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {notes.map((note, index) => (
                <div 
                  key={note._id} 
                  className="card-interactive p-6 group animate-slide-up hover-lift"
                  style={{ animationDelay: `${300 + index * 50}ms`, borderTop: '7px solid var(--accent)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                      {note.subject}
                    </span>
                    <div className="flex gap-2">
                      {isOwner(note) && (
                        <>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 hover-scale"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/notes/${note._id}/edit`)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 hover-scale"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleFavorite(note._id)}
                        className={`p-2 rounded-lg transition-all duration-200 hover-scale ${
                          favorites.includes(note._id) 
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                            : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(note._id) ? "fill-current" : ""}`} />
                      </button>
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

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-2">
                      <Download className="w-3 h-3" />
                      <span>{note.downloadCount || 0} downloads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-3 h-3" />
                      <span>{note.averageRating > 0 ? note.averageRating.toFixed(1) : 'No ratings yet'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/notes/${note._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-border rounded-lg text-foreground hover:bg-accent transition-all duration-200 hover-scale"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(note._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-gradient-primary text-white'
                          : 'border border-border text-foreground hover:bg-accent'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotesBrowsingPage;