import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    token: string | null;
    role: string | null;
    nome: string | null;
    isAuthenticated: boolean;
    login: (token: string, role: string, nome: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole]   = useState<string | null>(localStorage.getItem('role'));
    const [nome, setNome]   = useState<string | null>(localStorage.getItem('nome'));

    const login = (newToken: string, newRole: string, newNome: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole);
        localStorage.setItem('nome', newNome);
        setToken(newToken);
        setRole(newRole);
        setNome(newNome);
        navigate('/produtos');
    };

    const logout = () => {
        localStorage.clear();
        setToken(null); setRole(null); setNome(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, role, nome, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
    return ctx;
}
