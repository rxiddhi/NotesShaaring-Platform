import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('token');
  return isLoggedIn ? <Navigate to="/dashboard" /> : children;
} 