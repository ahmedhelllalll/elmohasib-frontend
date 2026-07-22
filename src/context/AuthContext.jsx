import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
axios.defaults.headers.common['Accept'] = 'application/json';

const initialToken = localStorage.getItem('auth_token');
if (initialToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(initialToken || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/me');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await axios.post('/login', { email, password });
        const { user, token } = response.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('auth_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const register = async (name, email, password, password_confirmation, business_name) => {
        const response = await axios.post('/register', {
            name,
            email,
            password,
            password_confirmation,
            business_name
        });
        const { user, token } = response.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('auth_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post('/logout');
            }
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('auth_token');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const forgotPassword = async (email) => {
        return await axios.post('/forgot-password', { email });
    };

    const resetPassword = async (token, email, password, password_confirmation) => {
        return await axios.post('/reset-password', {
            token,
            email,
            password,
            password_confirmation
        });
    };

    const verifyEmail = async (url) => {
        // url is the full signed URL provided by backend
        return await axios.get(url);
    };

    const resendVerification = async () => {
        return await axios.post('/email/verification-notification');
    };

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    console.warn('Unauthorized. Logging out...');
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, token, loading, 
            login, register, logout, 
            forgotPassword, resetPassword, 
            verifyEmail, resendVerification 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
