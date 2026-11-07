import React from 'react';
import { Navigate } from 'react-router-dom';

export const normalizeRole = (role) => {
    const value = String(role || '').toLowerCase().trim();

    if (value === 'provider' || value === 'officer') {
        return 'machinery_provider';
    }

    return value;
};

export const getDashboardPath = (user) => {
    if (!user) {
        return '/login';
    }

    switch (normalizeRole(user.role)) {
        case 'farmer':
            return '/farmer/dashboard';
        case 'machinery_provider':
            return '/provider/dashboard';
        case 'admin':
            return '/admin/dashboard';
        default:
            return '/';
    }
};

export const roleMatches = (userRole, requiredRole) => {
    if (!requiredRole) {
        return true;
    }

    return normalizeRole(userRole) === normalizeRole(requiredRole);
};

const ProtectedRoute = ({ element, role }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    try {
        const userData = JSON.parse(user);

        if (role && !roleMatches(userData.role, role)) {
            return (
                <Navigate
                    to={getDashboardPath(userData)}
                    replace
                />
            );
        }
    } catch (error) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default ProtectedRoute;
