import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { UserPlus, Upload, Search, Download, Eye, Heart, List, Filter } from 'lucide-react';

const features = [
  { title: "Smart Search", desc: "Quickly find notes by title, author, or subject using an intuitive search bar with advanced filtering.", icon: Search, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Subject Filters", desc: "Filter notes based on your semester subjects like DSA, WAP, Math, PSP and more with one click.", icon: Filter, color: "text-green-600", bg: "bg-green-100" },
  { title: "Sort & Organize", desc: "Sort notes by popularity, upload date, or alphabetical order to find exactly what you need.", icon: List, color: "text-purple-600", bg: "bg-purple-100" },
  { title: "Quick View", desc: "Preview notes before downloading and make informed choices about your study materials.", icon: Eye, color: "text-orange-600", bg: "bg-orange-100" },
  { title: "Save Favorites", desc: "Bookmark frequently used notes for quick access from your personal dashboard anytime.", icon: Heart, color: "text-pink-600", bg: "bg-pink-100" },
  { title: "Auto-Sync", desc: "All your uploads and saved notes are automatically synced across all your devices seamlessly.", icon: Download, color: "text-indigo-600", bg: "bg-indigo-100" },
];

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up for free and join our community of learners and educators.',
    step: '01'
  },
  {
    icon: Upload,
    title: 'Upload Notes',
    description: 'Share your knowledge by uploading your study notes and resources.',
    step: '02'
  },
  {
    icon: Search,
    title: 'Discover Content',
    description: 'Browse and search through thousands of high-quality educational materials.',
    step: '03'
  },
  {
    icon: Download,
    title: 'Access & Learn',
    description: 'Download notes instantly and accelerate your learning journey.',
    step: '04'
  }
];

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans overflow-auto">


        <section className="text-center py-24 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 flex justify-center items-center gap-2">
            📚 Browse Notes Effortlessly
          </h1>
          <p className="text-2xl text-gray-700 mb-6">Discover, download, and share notes tailored for your curriculum.</p>
          <div className="flex justify-center gap-4">
            <Link to="/browse" className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 shadow-md transition text-xl font-semibold">Browse Notes</Link>
            <Link to="/upload" className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition text-xl font-semibold">Upload Notes</Link>
          </div>
        </section>


        <section className="py-16 bg-white">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">🚀 Platform Features</h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Everything you need to discover, organize, and share educational content seamlessly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="bg-indigo-50 rounded-2xl p-6 shadow hover:shadow-xl transition group hover:scale-[1.02]">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 text-white ${f.bg}`}>
                  {<f.icon className={`w-6 h-6 ${f.color}`} />}
                </div>
                <h3 className="text-xl font-bold mb-2 text-indigo-700 group-hover:text-indigo-900">{f.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>


        <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                How It <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
                Get started in minutes with our simple and intuitive process designed for seamless knowledge sharing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative group">
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 transform translate-x-4 z-0"></div>
                    )}
                    <div className="relative z-10 text-center">
                      <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {step.step}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{step.title}</h3>
                      <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        <section className="py-20 px-6 text-center bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto mb-10">
            Start uploading or downloading notes in seconds.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
            <Link
              to="/browse"
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all text-xl font-semibold"
            >
              Start Browsing →
            </Link>
            <Link
              to="/upload"
              className="px-8 py-3 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-500 transition-all text-xl font-semibold"
            >
              Upload Notes
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-base text-gray-600 font-medium">
          </div>
        </section>

<footer className="bg-white py-10 text-center border-t">
  <div className="flex justify-center items-center gap-2 text-indigo-700 font-bold text-xl mb-2">
    <span className="text-purple-600 text-2xl">📖</span> NotesShare
  </div>
  <p className="text-gray-600 text-base mb-4">
    Built by students, for students. Join our community and start your learning journey today!
  </p>
  <hr className="max-w-xs mx-auto my-4 border-gray-200" />
  <p className="text-sm text-gray-400">
    © 2025 <span className="font-semibold">NoteNest</span> • Built with <span className="text-purple-400">💜</span> by students
  </p>
</footer>
      </div>
    </>
  );
}