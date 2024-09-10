import React, {useState, createContext, useContext, useEffect} from "react";
import axios from "axios";

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (token: string) => void;
    logout:  () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() =>{
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:3000/user/profile',{
                headers: {Authorization: `Bearer ${token}`}
            })
            .then(response => {
                setIsAuthenticated(true);
                setUser(response.data.user);
            })
            .catch(() =>{
                localStorage.removeItem('token');
            });
        }
    },[]);

    const login = (token:string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        //Aquí deberías obtener la info del usuario y establecerlo con setUser
    };

    const logout = () =>{
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    }

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