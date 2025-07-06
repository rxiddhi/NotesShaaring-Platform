import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  BookOpen, 
  AlertCircle, 
  Loader,
  ArrowLeft
} from 'lucide-react';
import ReviewList from '../components/Reviews/ReviewList';

const API_BASE_URL = 'http://localhost:3000/api';

const NoteDetailsPage = () => {
  const { id: noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchNote();
    fetchCurrentUser();
  }, [noteId]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData.user);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`);
      
      if (response.ok) {
        const data = await response.json();
        setNote(data.note);
      } else {
        setError('Note not found');
      }
    } catch (err) {
      console.error('Failed to load note:', err);
      setError('Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to download notes');
        navigate('/login');
        return;
      }

      console.log('Token exists:', !!token);
      console.log('Token length:', token.length);

      // Track the download
      const downloadResponse = await fetch(`${API_BASE_URL}/notes/${noteId}/download`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Download tracking response status:', downloadResponse.status);

      if (!downloadResponse.ok) {
        if (downloadResponse.status === 401) {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        console.warn('Failed to track download, but continuing with file download');
      }

      // Download the file using the authenticated route
      if (note) {
        const downloadUrl = `${API_BASE_URL}/notes/${noteId}/download-file`;
        console.log('Downloading from:', downloadUrl);
        
        // Fetch the file with authorization header
        const response = await fetch(downloadUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('File download response status:', response.status);
        
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
          const errorText = await response.text();
          console.error('Download failed with status:', response.status, 'Error:', errorText);
          
          if (response.status === 401) {
            alert('Your session has expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          
          throw new Error(`Failed to download file: ${response.status}`);
        }
      }

      // Refresh note to update download count
      fetchNote();
    } catch (error) {
      console.error('Error downloading note:', error);
      alert('Failed to download note. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete notes');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        navigate('/browse');
      } else {
        alert('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card-interactive p-8 text-center max-w-md animate-scale-in">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Note Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || 'The note you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && note.uploadedBy && (
    (typeof note.uploadedBy === 'object' ? note.uploadedBy._id : note.uploadedBy)?.toString() === (currentUser.userId || currentUser._id)?.toString()
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/browse')}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6 animate-slide-up"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </button>

        {/* Note Details */}
        <div className="card-interactive p-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {note.subject}
                </span>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{note.uploadedBy?.username || 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">{note.title}</h1>
              
              {note.description && (
                <p className="text-muted-foreground leading-relaxed mb-6">{note.description}</p>
              )}
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => navigate(`/notes/${noteId}/edit`)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 hover-scale"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 hover-scale"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-foreground">{note.downloadCount || 0}</div>
              <div className="text-xs text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-foreground">{note.likes || 0}</div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-foreground">{note.reviewCount || 0}</div>
              <div className="text-xs text-muted-foreground">Reviews</div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {note.averageRating ? note.averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleDownload}
              className="bg-gradient-primary text-white px-8 py-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover-scale btn-animated flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Note</span>
            </button>
          </div>

          {/* File Information */}
          {note.fileUrl && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">File Information</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {note.title || 'Untitled Note'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {note.fileUrl.split('.').pop().toUpperCase()} file
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Downloads: {note.downloadCount || 0}
                    </p>
                  </div>
                </div>
              </div>
                              <div className="mt-4 p-4 bg-accent-light/20 dark:bg-accent/30 rounded-lg border border-accent/30 dark:border-accent/50">
                  <p className="text-sm text-accent dark:text-accent-light">
                  💡 <strong>Tip:</strong> Click the download button above to save and view this file on your device.
                </p>
              </div>
              <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  ⚠️ <strong>Note:</strong> Some older files may not be immediately accessible. If download fails, please try again later or contact the uploader.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <ReviewList noteId={noteId} currentUserId={currentUser?.userId} />
        </div>
      </div>
    </div>
  );
};

export default NoteDetailsPage;
