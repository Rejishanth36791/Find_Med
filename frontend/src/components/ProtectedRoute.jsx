import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token) {
        // If not logged in, redirect to the hidden admin login
        // Note: We might want to make this configurable, but for now /admin/u/login is the target
        return <Navigate to="/admin/u/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userType)) {
        // If logged in but wrong role (e.g. Civilian trying to access Admin Dashboard)
        // Redirect to their respective home or a generic unauthorized page
        if (userType === 'CIVILIAN') return <Navigate to="/civilian" replace />;
        if (userType === 'PHARMACY') return <Navigate to="/pharmacy" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
