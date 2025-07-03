import { useState, useEffect } from 'react';

const mockDoubts = [
    { id: 1, title: 'How does useEffect work?', author: 'Alice', date: '2025-07-01', time: '10:30', subject: 'React', answers: [] },
    { id: 2, title: 'Difference between var, let, const?', author: 'Bob', date: '2025-06-29', time: '14:15', subject: 'JavaScript', answers: [] },
    { id: 3, title: 'What is the virtual DOM?', author: 'Charlie', date: '2025-07-02', time: '09:05', subject: 'React', answers: [] },
];

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
    const [doubts, setDoubts] = useState(mockDoubts);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('newest');
    const [newDoubt, setNewDoubt] = useState('');
    const [newSubject, setNewSubject] = useState(SUBJECTS[0]);
    const [answerInputs, setAnswerInputs] = useState({});

    useEffect(() => {
        let filtered = [...mockDoubts].filter((d) =>
            d.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortType === 'newest') {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortType === 'oldest') {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortType === 'az') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        setDoubts(filtered);
    }, [searchTerm, sortType]);

    const handlePost = () => {
        if (newDoubt.trim() !== '') {
            const now = new Date();
            const newEntry = {
                id: doubts.length + 1,
                title: newDoubt,
                author: 'You',
                date: now.toISOString().split('T')[0],
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                subject: newSubject,
                answers: [],
            };
            setDoubts([newEntry, ...doubts]);
            setNewDoubt('');
            setNewSubject(SUBJECTS[0]);
        }
    };

    const handleAnswerInput = (doubtId, value) => {
        setAnswerInputs((prev) => ({ ...prev, [doubtId]: value }));
    };

    const handlePostAnswer = (doubtId) => {
        const answer = answerInputs[doubtId]?.trim();
        if (!answer) return;
        setDoubts((prevDoubts) =>
            prevDoubts.map((d) =>
                d.id === doubtId
                    ? {
                          ...d,
                          answers: [
                              ...d.answers,
                              {
                                  text: answer,
                                  author: 'You',
                                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              },
                          ],
                      }
                    : d
            )
        );
        setAnswerInputs((prev) => ({ ...prev, [doubtId]: '' }));
    };

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
                    {doubts.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500 text-lg border-t-4 border-pink-300">
                            No doubts found. Be the first to post!
                        </div>
                    ) : (
                        doubts.map((doubt) => (
                            <div key={doubt.id} className="bg-white rounded-2xl shadow-lg border-t-4 border-indigo-300 hover:scale-[1.01] transition-transform">
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">{doubt.subject}</span>
                                    </div>
                                    <h3 className="font-bold text-2xl text-purple-700 mb-2">{doubt.title}</h3>
                                    <p className="text-sm text-gray-500 mb-1 flex flex-wrap gap-2 items-center">
                                        By <span className="font-semibold text-indigo-600">{doubt.author}</span> on {doubt.date} <span className="text-gray-400">at {doubt.time}</span>
                                    </p>

                                    {/* Answers Section */}
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-base text-gray-700 mb-2">Answers</h4>
                                        {doubt.answers.length === 0 ? (
                                            <p className="text-gray-400 text-sm mb-2">No answers yet. Be the first to answer!</p>
                                        ) : (
                                            <ul className="space-y-2 mb-2">
                                                {doubt.answers.map((ans, idx) => (
                                                    <li key={idx} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium text-indigo-700">{ans.author}</span>
                                                            <span className="text-xs text-gray-400">{ans.time}</span>
                                                        </div>
                                                        <div className="text-gray-700 text-sm">{ans.text}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            <input
                                                type="text"
                                                placeholder="Add your answer..."
                                                value={answerInputs[doubt.id] || ''}
                                                onChange={(e) => handleAnswerInput(doubt.id, e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                                            />
                                            <button
                                                onClick={() => handlePostAnswer(doubt.id)}
                                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 text-sm"
                                            >
                                                Answer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}