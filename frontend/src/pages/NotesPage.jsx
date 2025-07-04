import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReviewList from '../components/Reviews/ReviewList';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? "https://notenest-lzm0.onrender.com/api"
  : "http://localhost:3000/api";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editFile, setEditFile] = useState(null);

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
      const res = await axios.get(`${API_BASE_URL}/notes`);
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

  useEffect(() => {
    if (editModalOpen && noteToEdit) {
      setEditTitle(noteToEdit.title || "");
      setEditSubject(noteToEdit.subject || "");
      setEditDescription(noteToEdit.description || "");
      setEditFile(null);
      setEditError("");
    }
  }, [editModalOpen, noteToEdit]);

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setDeleting(noteId);
    try {
      await axios.delete(`${API_BASE_URL}/notes/${noteId}`, {
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
      await axios.put(`${API_BASE_URL}/notes/${note._id}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const response = await axios.get(note.fileUrl, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
  
      // Sanitize title and enforce .pdf
      const cleanTitle = (note.title || "note")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const filename = `${cleanTitle}.pdf`;
  
      link.href = url;
      link.setAttribute('download', filename);
  
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  
      fetchNotes(); // Refresh download count
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("token");
      let data;
      let headers;
      if (editFile) {
        data = new FormData();
        data.append("title", editTitle);
        data.append("subject", editSubject);
        data.append("description", editDescription);
        data.append("file", editFile);
        headers = { Authorization: `Bearer ${token}` };
      } else {
        data = {
          title: editTitle,
          subject: editSubject,
          description: editDescription,
        };
        headers = { Authorization: `Bearer ${token}` };
      }
      await axios.patch(`${API_BASE_URL}/notes/${noteToEdit._id}`, data, {
        headers: editFile ? { ...headers, "Content-Type": "multipart/form-data" } : headers,
      });
      setEditModalOpen(false);
      setNoteToEdit(null);
      fetchNotes();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update note.");
    } finally {
      setEditLoading(false);
    }
  };

  const renderNoteCard = (note) => {
    const fileExt = note.fileUrl.split('.').pop().split('?')[0].toUpperCase();
    const isUploader = currentUserId && (note.uploadedBy && (note.uploadedBy._id === currentUserId || note.uploadedBy === currentUserId));
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
          {isUploader && (
            <>
              <button
                onClick={() => handleDelete(note._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                disabled={deleting === note._id}
              >
                {deleting === note._id ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => { setNoteToEdit(note); setEditModalOpen(true); }}
                className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm font-semibold shadow transition"
              >
                Edit
              </button>
            </>
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

      {editModalOpen && noteToEdit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.3)' }}>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Note</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={e => setEditSubject(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Replace PDF (optional)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setEditFile(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Current File Type: {noteToEdit.fileUrl ? noteToEdit.fileUrl.split('.').pop().split('?')[0].toUpperCase() : 'N/A'}
                </div>
              </div>
              {editError && <div className="text-red-500 text-sm">{editError}</div>}
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 disabled:opacity-60"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
