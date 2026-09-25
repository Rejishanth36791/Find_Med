import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from local storage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        // Return a dummy context if used outside provider or if provider missing (fallback)
        // But better to throw error or handle gracefully
        // For now, try to recover from localStorage if context is null (rare if wrapped correctly)
        // Actually, if context is missing, it means component is not wrapped in AuthProvider.
        // We will return a context that attempts to read from localStorage directly as a failsafe

        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                return { user: JSON.parse(storedUser) };
            }
        } catch (e) { }

        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
