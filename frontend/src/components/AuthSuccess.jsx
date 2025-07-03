import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
 
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } 
    
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg font-semibold text-gray-700">Logging you in with Google...</div>
    </div>
  );
} 
