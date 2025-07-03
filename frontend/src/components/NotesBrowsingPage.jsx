import React, { useState, useEffect } from "react";
import {
  FaDownload,
  FaEye,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaBookOpen,
  FaFilePdf,
} from "react-icons/fa";

const NotesBrowsingPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [sortBy, setSortBy] = useState("newest");
  const [likedNotes, setLikedNotes] = useState([]);


  useEffect(() => {
    const stored = localStorage.getItem("likedNotes");
    if (stored) setLikedNotes(JSON.parse(stored));
  }, []);


  useEffect(() => {
    localStorage.setItem("likedNotes", JSON.stringify(likedNotes));
  }, [likedNotes]);


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/notes");
        if (!res.ok) throw new Error("Failed to fetch notes");

        const data = await res.json();
        const enriched = (data.notes || []).map((note) => ({
          ...note,
          likes: note.likes || 0,
        }));

        setNotes(enriched);
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);


  const handleLikeToggle = (noteId) => {
    const updatedNotes = notes.map((note) => {
      if (note._id === noteId) {
        const isLiked = likedNotes.includes(noteId);
        const updatedLikes = isLiked
          ? Math.max(0, (note.likes || 0) - 1)
          : (note.likes || 0) + 1;
        return { ...note, likes: updatedLikes };
      }
      return note;
    });

    setNotes(updatedNotes);
    setLikedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };


  const trackDownload = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/api/notes/${noteId}/download`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      console.error("Download tracking failed");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const extractSubjects = () => {
    const subjectsSet = new Set();
    notes.forEach((n) => n.subject && subjectsSet.add(n.subject));
    return ["All Subjects", ...Array.from(subjectsSet)];
  };

  const subjects = extractSubjects();

  const filteredNotes = notes
    .filter((n) => {
      const matchText =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.uploadedBy?.username?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSubject =
        selectedSubject === "All Subjects" || n.subject === selectedSubject;

      return matchText && matchSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular":
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });


  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-100 text-red-600 p-6 rounded-lg shadow">
          <h2 className="font-bold mb-2">Failed to load notes</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-pink-100">
      <h1 className="text-3xl font-bold mb-4 text-purple-700">Browse Notes</h1>

      <div className="flex flex-wrap gap-3 items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-md flex-1">
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      <p className="mb-4 text-slate-600">
        Showing {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
      </p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between text-sm mb-2 text-slate-500">
              <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                <FaBookOpen /> {note.subject || "Unknown"}
              </span>
              <span>{note.pageCount || "N/A"} pages</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-1">{note.title}</h3>
            <p className="text-sm text-slate-600 flex items-center gap-1">
              <FaUser /> {note.uploadedBy?.username || "Anonymous"}
            </p>
            <p className="text-sm text-slate-600 flex items-center gap-1 mb-2">
              <FaCalendarAlt /> {formatDate(note.createdAt)}
            </p>

            <div className="text-xs text-slate-400 flex justify-between mt-3">
              <span>{note.downloadCount || 0} downloads</span>
              <span>PDF</span>
            </div>

            <div className="mt-4 flex justify-between items-center gap-2">
              <button
                onClick={() => window.open(note.fileUrl, "_blank")}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
              >
                <FaEye /> View
              </button>

              <button
                onClick={async () => {
                  await trackDownload(note._id);
                  fetch(note.fileUrl)
                    .then((res) => res.blob())
                    .then((blob) => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${note.title}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                    })
                    .catch(() => alert("Download failed."));
                }}
                className="flex-1 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-md flex justify-center items-center gap-2 hover:scale-105 transition shadow"
              >
                <FaDownload /> Download
              </button>

              <button
                onClick={() => handleLikeToggle(note._id)}
                className="text-lg hover:scale-110 transition"
              >
                {likedNotes.includes(note._id) ? "❤️" : "🤍"}{" "}
                <span className="text-sm ml-1">{note.likes || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesBrowsingPage;
