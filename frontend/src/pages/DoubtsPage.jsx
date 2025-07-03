import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SUBJECTS = [
    'General',
    'React',
    'JavaScript',
    'DSA',
    'Math',
    'WAP',
    'PSP',
    'Other',
];

export default function DoubtsPage() {
    const [doubts, setDoubts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('newest');
    const [newDoubt, setNewDoubt] = useState('');
    const [newSubject, setNewSubject] = useState(SUBJECTS[0]);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editSubject, setEditSubject] = useState(SUBJECTS[0]);
    const navigate = useNavigate();

    // Get current userId from token
    let currentUserId = null;
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            currentUserId = decoded.userId || decoded.id || decoded.sub;
        } catch {
            currentUserId = null;
        }
    }

    useEffect(() => {
        fetchDoubts();
    }, []);

    const fetchDoubts = async () => {
        try {
            const res = await axios.get('/api/doubts');
            setDoubts(res.data.doubts || []);
        } catch {
            setDoubts([]);
        }
    };

    const handlePost = async () => {
        if (newDoubt.trim() !== '') {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.post('/api/doubts', {
                    title: newDoubt,
                    subject: newSubject,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoubts([res.data.doubt, ...doubts]);
                setNewDoubt('');
                setNewSubject(SUBJECTS[0]);
            } catch {
                // handle error
            }
        }
    };

    const handleEdit = (doubt) => {
        setEditingId(doubt._id);
        setEditTitle(doubt.title);
        setEditSubject(doubt.subject);
    };

    const handleEditSave = async (doubtId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`/api/doubts/${doubtId}`, {
                title: editTitle,
                subject: editSubject,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubts(doubts.map(d => d._id === doubtId ? res.data.doubt : d));
            setEditingId(null);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert('This doubt no longer exists. The list will refresh.');
                fetchDoubts();
                setEditingId(null);
            } else {
                // handle other errors
            }
        }
    };

    const handleDelete = async (doubtId) => {
        if (!window.confirm('Delete this doubt?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/doubts/${doubtId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoubts(doubts.filter(d => d._id !== doubtId));
        } catch (err) {
            if (err.response && err.response.status === 404) {
                alert('This doubt was already deleted. The list will refresh.');
                fetchDoubts();
            } else {
                // handle other errors
            }
        }
    };

    // Filter and sort doubts
    const filteredDoubts = doubts
        .filter((d) => d.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortType === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
            if (sortType === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
            if (sortType === 'az') return a.title.localeCompare(b.title);
            return 0;
        });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">Ask & Explore Doubts</h1>
                <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">Post your academic questions and help others by sharing answers. Search, sort, and browse doubts from the community!</p>

                {/* Post a new doubt */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-center bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-400">
                    <input
                        placeholder="Post a new doubt..."
                        value={newDoubt}
                        onChange={(e) => setNewDoubt(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 text-lg"
                    />
                    <select
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="p-3 border border-gray-300 rounded-xl bg-gray-50 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        {SUBJECTS.map((subject) => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                    <button
                        onClick={handlePost}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold shadow hover:from-purple-600 hover:to-indigo-600 transition-all text-lg"
                    >
                        Post
                    </button>
                </div>

                {/* Search and sort */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-white rounded-xl shadow p-4">
                    <input
                        placeholder="Search doubts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-base"
                    />
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="az">A-Z</option>
                    </select>
                </div>

                {/* Doubts list */}
                <div className="grid gap-6 mt-8">
                    {filteredDoubts.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500 text-lg border-t-4 border-pink-300">
                            No doubts found. Be the first to post!
                        </div>
                    ) : (
                        filteredDoubts.map((doubt) => (
                            <div key={doubt._id} className="bg-white rounded-2xl shadow-lg border-t-4 border-indigo-300 hover:scale-[1.01] transition-transform cursor-pointer group" onClick={() => editingId ? null : navigate(`/doubts/${doubt._id}`)}>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">{doubt.subject}</span>
                                    </div>
                                    {editingId === doubt._id ? (
                                        <div className="flex flex-col md:flex-row gap-2 mb-2">
                                            <input
                                                value={editTitle}
                                                onChange={e => setEditTitle(e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded"
                                            />
                                            <select
                                                value={editSubject}
                                                onChange={e => setEditSubject(e.target.value)}
                                                className="p-2 border border-gray-300 rounded"
                                            >
                                                {SUBJECTS.map((subject) => (
                                                    <option key={subject} value={subject}>{subject}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => handleEditSave(doubt._id)} className="px-3 py-1 bg-green-500 text-white rounded">Save</button>
                                            <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="font-bold text-2xl text-purple-700 mb-2">{doubt.title}</h3>
                                            <p className="text-sm text-gray-500 mb-1 flex flex-wrap gap-2 items-center">
                                                By <span className="font-semibold text-indigo-600">{doubt.userId?.name || doubt.userId?.username || doubt.userId?.email || 'User'}</span> on {new Date(doubt.timestamp).toLocaleDateString()} <span className="text-gray-400">at {new Date(doubt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </p>
                                        </>
                                    )}
                                    {currentUserId && doubt.userId && doubt.userId._id === currentUserId && !editingId && (
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={e => { e.stopPropagation(); handleEdit(doubt); }} className="px-3 py-1 bg-yellow-400 text-white rounded">Edit</button>
                                            <button onClick={e => { e.stopPropagation(); handleDelete(doubt._id); }} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}