import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Get current user ID from JWT
  let currentUserId = null;
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.id || (decoded.user && decoded.user.id) || decoded.userId;
    } catch {
      currentUserId = null;
    }
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/notes');
        setNotes(response.data.notes);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setDeleting(noteId);
    try {
      await axios.delete(`http://localhost:3000/api/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (err) {
      alert(
        err.response?.data?.message || 'Failed to delete note. You may not be authorized.'
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📚 All Uploaded Notes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {notes.map(note => (
            <div key={note._id} className="bg-white rounded-xl shadow p-4 border">
              <h3 className="font-bold text-lg">{note.title}</h3>
              <p className="text-sm text-gray-600">{note.subject}</p>
              {note.description && <p className="mt-1 text-gray-700">{note.description}</p>}
              <a 
                href={`http://localhost:3000${note.fileUrl}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block mt-2 text-blue-500 hover:underline"
              >
                📎 View File
              </a>
              {note.uploadedBy && (
                <p className="text-xs text-gray-500 mt-1">
                  Uploaded by: {note.uploadedBy.username || note.uploadedBy.email}
                </p>
              )}
              {/* Show delete button only if current user is the uploader */}
              {currentUserId && (note.uploadedBy?._id === currentUserId || note.uploadedBy === currentUserId) && (
                <button
                  onClick={() => handleDelete(note._id)}
                  className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  disabled={deleting === note._id}
                >
                  {deleting === note._id ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
