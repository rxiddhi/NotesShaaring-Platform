import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = localStorage.getItem("token");
        return token && token.length > 10;
    });

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(token && token.length > 10);
        };

        // Listen for auth changes
        window.addEventListener('authChange', checkAuth);
        
        // Initial check
        checkAuth();

        return () => {
            window.removeEventListener('authChange', checkAuth);
        };
    }, []);

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
