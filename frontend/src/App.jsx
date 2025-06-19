import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NotesUploadPage from './components/NotesUploadPage';
import NotesBrowsingPage from './components/NotesBrowsingPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload" element={<NotesUploadPage />} />
        <Route path="/browse" element={<NotesBrowsingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
