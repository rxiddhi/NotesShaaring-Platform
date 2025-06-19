import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NotesUploadPage from './components/NotesUploadPage';
import NotesBrowsingPage from './components/NotesBrowsingPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route 
          path="/upload" 
          element={
            <PrivateRoute>
              <NotesUploadPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/browse" 
          element={
            <PrivateRoute>
              <NotesBrowsingPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
