# 📚 Notes Sharing Platform

A full-stack MERN web application for uploading, sharing, and reviewing academic notes. Built with **React** (Vite) for the frontend and **Node.js/Express** for the backend.

---

## 🔧 Tech Stack

- **Frontend**: React.js (Vite)
- **Backend**: Node.js, Express.js
- **Styling**: Tailwind CSS / CSS
- **Database**: MongoDB (via Mongoose)
- **File Uploads**: (Planned: Firebase/Local storage)
- **Hosting**: Vercel / Netlify / Render / Railway

---

## 📸 Features

- 🔐 User Authentication (Register & Login)
- 📤 Upload notes (PDF, DOC, etc.)
- 📁 View & Download shared notes
- 🗂️ Organize by subject/topic
- 🔍 Search notes easily
- ⭐ Rate and review uploaded notes _(future enhancement)_

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas connection string _(for contributors)_

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/notes-sharing-platform.git
cd notes-sharing-platform
```

2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

4. Set Up Environment Variables

Copy .env.example to .env inside the backend/ directory.

Fill in the required values

## 🏃‍♂️ Running the Application

### Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend

```bash
cd backend
# For development with auto-reload:
npm run dev

# For production:
npm start
```

The backend server will start on `http://localhost:3000`

### Common Issues

- If you see "Missing script: start", ensure your backend/package.json has the correct scripts section
- Install nodemon globally if needed: `npm install -g nodemon`
- Make sure you have all dependencies installed: `npm install`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
