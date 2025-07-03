import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReviewList from '../components/Reviews/ReviewList';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const token = localStorage.getItem('token');
  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.userId || decoded.id;
    } catch {
      currentUserId = null;
    }
  }

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/api/notes');
      setNotes(res.data.notes);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setDeleting(noteId);
    try {
      await axios.delete(`/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (note) => {
    if (!token || !currentUserId) {
      alert("Please log in to download notes.");
      return;
    }

    setDownloading(note._id);
    try {
      // Track download count
      await axios.put(`/api/notes/${note._id}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Download the file from Cloudinary
      const fileRes = await axios.get(note.fileUrl, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([fileRes.data]));
      const link = document.createElement('a');
      const extension = note.fileUrl.split('.').pop().split('?')[0]; // Handle cloudinary URLs
      const filename = `${note.title || 'note'}.${extension}`;
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      fetchNotes(); // Refresh counts
    } catch (err) {
      alert('Download failed.');
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  const uploadedNotes = notes.filter(note => {
    if (!note.uploadedBy) return false;
    const uploaderId = typeof note.uploadedBy === 'object' ? note.uploadedBy._id : note.uploadedBy;
    return uploaderId === currentUserId;
  });

  const downloadedNotes = notes.filter(note => {
    if (!Array.isArray(note.downloadedBy)) return false;
    return note.downloadedBy.some(user =>
      user && (typeof user === 'object' ? user._id === currentUserId : user === currentUserId)
    );
  });

  const renderNoteCard = (note) => {
    const fileExt = note.fileUrl.split('.').pop().split('?')[0].toUpperCase();
    return (
      <div key={note._id} className="bg-white rounded-xl shadow p-4 border">
        <h3 className="font-bold text-lg">{note.title}</h3>
        <p className="text-sm text-gray-600">{note.subject}</p>
        {note.description && <p className="mt-1 text-gray-700">{note.description}</p>}
        <p className="text-xs text-gray-500 mt-1">File Type: {fileExt}</p>
        <p className="text-xs text-gray-500">Downloads: {note.downloadCount}</p>
        <p className="text-xs text-gray-500 mt-1">
          Uploaded by: {note.uploadedBy?.username || note.uploadedBy?.email || 'Anonymous'}
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleDownload(note)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            disabled={downloading === note._id}
          >
            {downloading === note._id ? 'Downloading...' : 'Download'}
          </button>
          {currentUserId &&
            (note.uploadedBy && (note.uploadedBy._id === currentUserId || note.uploadedBy === currentUserId)) && (
              <button
                onClick={() => handleDelete(note._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                disabled={deleting === note._id}
              >
                {deleting === note._id ? 'Deleting...' : 'Delete'}
              </button>
            )}
        </div>
        <button
          onClick={() => {
            setSelectedNoteId(note._id);
            setModalOpen(true);
          }}
          className="mt-3 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-md hover:from-purple-600 hover:to-blue-600 font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Add/View Reviews
        </button>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📚 My Notes Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section className="mb-10">
            <h3 className="text-xl font-semibold mb-2 text-green-700">🟢 My Uploaded Notes</h3>
            {uploadedNotes.length === 0 ? (
              <p className="text-gray-500">You haven't uploaded any notes yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {uploadedNotes.map(renderNoteCard)}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">🔵 My Downloaded Notes</h3>
            {downloadedNotes.length === 0 ? (
              <p className="text-gray-500">You haven't downloaded any notes yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {downloadedNotes.map(renderNoteCard)}
              </div>
            )}
          </section>
        </>
      )}

  
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.3)' }}>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <ReviewList noteId={selectedNoteId} currentUserId={currentUserId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
