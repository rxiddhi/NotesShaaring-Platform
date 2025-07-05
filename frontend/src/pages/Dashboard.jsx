// ✅ FINAL DASHBOARD.JSX WITH IMAGE + BIO FIX

import {
  Upload,
  Download,
  Star,
  Calendar,
  BookOpen,
  Users,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bio, setBio] = useState("");
  const [newBio, setNewBio] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [userData, setUserData] = useState({
    username: "",
    joinDate: new Date(),
    uploadedNotes: 0,
    downloadedNotes: 0,
    reviewsReceived: 0,
    uploadedThisMonth: 0,
    downloadedThisMonth: 0,
    reviewsThisMonth: 0,
    averageRating: 0,
    bio: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const response = await axios.get(`${API_BASE_URL}/api/users/dashboard-stats`, {

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { user, stats } = response.data;

        setUserData({
          username: user.username || user.name || "User",
          joinDate: new Date(user.joinDate),
          uploadedNotes: stats.uploadedNotes,
          downloadedNotes: stats.downloadedNotes,
          reviewsReceived: stats.reviewsReceived,
          uploadedThisMonth: stats.uploadedThisMonth,
          downloadedThisMonth: stats.downloadedThisMonth,
          reviewsThisMonth: stats.reviewsThisMonth,
          averageRating: stats.averageRating,
          imageUrl: user.imageUrl || "",   // ✅ Added
          bio: user.bio || "",             // ✅ Added
        });

        setBio(user.bio || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.response?.data?.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBioSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("bio", newBio);
      if (image) formData.append("image", image);

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/users/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBio(newBio);
      setUserData((prev) => ({
        ...prev,
        bio: newBio,
        imageUrl: res.data.imageUrl || prev.imageUrl,
      }));

      setShowModal(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const formatJoinDate = (date) => {
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const getTimeSinceJoining = (date) => {
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return "Today";
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? "s" : ""}`;
  };

  const handleUploadNote = () => navigate("/upload");
  const handleBrowseNotes = () => navigate("/browse");
  const handleViewReviews = () => navigate("/notes");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-600 font-medium">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg shadow max-w-md">
          <h2 className="text-lg font-semibold mb-2">Error loading dashboard</h2>
          <p className="text-sm mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 py-10 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 mb-10 border-t-4 border-purple-400 relative">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative">
            {userData.imageUrl ? (
              <img
                src={userData.imageUrl}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-purple-200"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {userData.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-3xl font-bold mb-1">Hi {userData.username} </h2>
            <p className="text-gray-600 flex gap-3 items-center text-sm">
              <Calendar className="w-4 h-4 text-purple-500" />
              Joined {formatJoinDate(userData.joinDate)} • {getTimeSinceJoining(userData.joinDate)} ago
            </p>
            {bio && <p className="text-sm mt-2 text-gray-700 italic">{bio}</p>}
          </div>
          <button
            className="absolute top-4 right-4 text-purple-600 hover:text-purple-800"
            onClick={() => {
              setShowModal(true);
              setNewBio(bio);
              setPreview(userData.imageUrl);
            }}
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
        <DashboardCard
          title="Uploaded Notes"
          icon={<Upload className="text-purple-600 w-6 h-6" />}
          color="purple"
          count={userData.uploadedNotes}
          subInfo={[{ label: "This month", value: userData.uploadedThisMonth }, { label: "Total views", value: "-" }]}
          actionText="Upload Note"
          onClick={handleUploadNote}
        />
        <DashboardCard
          title="Downloaded Notes"
          icon={<Download className="text-pink-600 w-6 h-6" />}
          color="pink"
          count={userData.downloadedNotes}
          subInfo={[{ label: "This month", value: userData.downloadedThisMonth }, { label: "Favorites", value: "-" }]}
          actionText="Browse Notes"
          onClick={handleBrowseNotes}
        />
        <DashboardCard
          title="Reviews Received"
          icon={<Star className="text-yellow-600 w-6 h-6" />}
          color="yellow"
          count={userData.reviewsReceived}
          subInfo={[
            { label: "Avg. rating", value: userData.averageRating > 0 ? `${userData.averageRating}★` : "-" },
            { label: "This month", value: userData.reviewsThisMonth },
          ]}
          actionText="View Reviews"
          onClick={handleViewReviews}
        />
      </div>

      {/* Footer & Edit Modal */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 border-t-4 border-indigo-400">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-indigo-600 w-6 h-6" />
          <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No recent activity</p>
          <p className="text-sm">Start uploading notes to see activity here</p>
        </div>
      </div>

      <footer className="text-center mt-12 text-gray-500 text-sm">
        © 2025 <span className="font-semibold">NoteNest</span> • Built with 💜 by students
      </footer>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X />
            </button>
            <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
            <textarea
              rows={4}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write your bio..."
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full mx-auto mt-3 object-cover border shadow"
              />
            )}
            <button
              onClick={handleBioSubmit}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Save className="inline w-4 h-4 mr-2" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ title, icon, count, subInfo, color, actionText, onClick }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border-t-4 border-${color}-400 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 bg-${color}-100 rounded-xl`}>{icon}</div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <span className={`text-2xl font-bold text-${color}-600`}>{count}</span>
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        {subInfo.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onClick}
        className={`mt-4 w-full py-2 rounded-lg text-${color}-600 bg-${color}-50 hover:bg-${color}-100 font-medium transition`}
      >
        {actionText}
      </button>
    </div>
  );
}
