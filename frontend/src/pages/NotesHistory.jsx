import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { BookOpen, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.MODE === "production"
  ? "https://notenest-lzm0.onrender.com/api"
  : "http://localhost:3000/api";

export default function NotesHistory() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  let currentUserId = null;
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.userId || decoded.id;
    } catch {
      currentUserId = null;
    }
  }

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/notes`);
        setNotes(res.data.notes);
      } catch {
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [location]);

  const viewedNotes = notes.filter(note => {
    if (!Array.isArray(note.viewedBy)) return false;
    return note.viewedBy.some(user =>
      user && (typeof user === 'object' ? user._id === currentUserId : user === currentUserId)
    );
  });

  const downloadedNotes = notes.filter(note => {
    if (!Array.isArray(note.downloadedBy)) return false;
    return note.downloadedBy.some(user =>
      user && (typeof user === 'object' ? user._id === currentUserId : user === currentUserId)
    );
  });

  const renderNoteCard = (note, colorClass) => (
    <div key={note._id} className={`rounded-xl p-5 shadow-lg border flex flex-col justify-between ${colorClass}`}>
      <div>
        <h3 className="text-lg font-bold text-white drop-shadow mb-1">{note.title}</h3>
        <p className="text-sm text-white/80 mb-1">{note.subject}</p>
        {note.description && <p className="text-white/90 mt-1 mb-2">{note.description}</p>}
        <p className="text-xs text-white/70 mt-2">By: {note.uploadedBy?.username || note.uploadedBy?.email || 'Anonymous'}</p>
      </div>
      <div className="flex gap-2 mt-4 flex-wrap">
        <Link
          to={`/notes/${note._id}`}
          className="px-3 py-1 text-sm bg-white/20 text-white rounded hover:bg-white/30 font-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  const renderEmptyState = (icon, message, colorClass) => (
    <div className={`flex flex-col items-center justify-center h-full min-h-[220px] rounded-xl border bg-muted/40 p-6 text-center ${colorClass}`}>
      {icon}
      <p className="mt-4 text-lg font-semibold text-muted-foreground">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-pink-500" /> Notes History
        </h1>
        {loading ? (
          <p className="text-center text-lg text-muted-foreground">Loading notes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Viewed Notes Column */}
            <div className="h-full">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-pink-600">
                <BookOpen className="w-6 h-6" /> Viewed Notes
              </h2>
              {viewedNotes.length === 0 ? (
                renderEmptyState(
                  <BookOpen className="w-12 h-12 text-pink-400 opacity-80" />, 
                  "No notes viewed yet.",
                  ""
                )
              ) : (
                <div className="grid gap-6">
                  {viewedNotes.map(note => renderNoteCard(note, 'bg-gradient-to-br from-pink-400 via-pink-500 to-fuchsia-500'))}
                </div>
              )}
            </div>
            {/* Downloaded Notes Column */}
            <div className="h-full">
                          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-accent">
              <Download className="w-12 h-12 text-accent opacity-80" /> Downloaded Notes
              </h2>
              {downloadedNotes.length === 0 ? (
                renderEmptyState(
                  <Download className="w-12 h-12 text-accent opacity-80" />, 
                  "No notes downloaded yet.",
                  ""
                )
              ) : (
                <div className="grid gap-6">
                  {downloadedNotes.map(note => renderNoteCard(note, 'bg-gradient-to-br from-[#ffb3a7] via-[#ff6f61] to-[#e05a47]'))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 