import React, { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (token: string, user: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('AuthProvider: Token from localStorage:', token);
        if (token) {
            axios.get('http://localhost:3000/api/users/profile', {
                headers: {Authorization: `Bearer ${token}`}
            })
            .then(response => {
                console.log('AuthProvider: Profile fetched successfully');
                setIsAuthenticated(true);
                setUser(response.data);
            })
            .catch((error) => {
                console.error('AuthProvider: Error fetching profile:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
            });
        } else {
            console.log('AuthProvider: No token found');
            setIsAuthenticated(false);
            setUser(null);
        }
    }, []);

    const login = (token: string, userData: any) => {
        console.log('AuthProvider: Login called');
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        console.log('AuthProvider: Logout called');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    }

    console.log('AuthProvider: Current state:', { isAuthenticated, user });

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};