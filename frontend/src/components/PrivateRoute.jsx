import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token && token.length > 10 ? children : <Navigate to="/login" />;    
};

export default PrivateRoute;
