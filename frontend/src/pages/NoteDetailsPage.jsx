import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ReviewList from '../components/Reviews/ReviewList';

const NoteDetailsPage = () => {
  const { id: noteId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.userId || decoded.id || decoded.sub;
    } catch {
      currentUserId = null;
    }
  }


  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/notes/${noteId}`);
        setNote(res.data.note);
      } catch (err) {
        console.error('Failed to load note:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!note) return <p className="p-4 text-red-600">Note not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">{note.title}</h2>
      <p className="text-gray-600">{note.subject}</p>
      {note.description && <p className="mt-2">{note.description}</p>}
      <p className="text-xs text-gray-500 mt-1">
        Uploaded by: {note.uploadedBy?.username || note.uploadedBy?.email || 'Anonymous'}
      </p>

      <ReviewList noteId={noteId} currentUserId={currentUserId} />
    </div>
  );
};

export default NoteDetailsPage;
