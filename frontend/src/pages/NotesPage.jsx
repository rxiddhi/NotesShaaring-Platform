import { useEffect, useState } from 'react';
import axios from 'axios';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
