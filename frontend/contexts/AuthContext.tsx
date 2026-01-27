/**
 * Authentication Context - Globální stav autentizace
 * Poskytuje informace o přihlášeném uživateli a autentizační metody
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import authService, { LoginCredentials, RegisterData } from '../services/authService';
import userService, { BackendUser } from '../services/userService';
import { removeToken } from '../utils/apiClient';

interface AuthContextType {
    user: BackendUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<BackendUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Načte uživatele z API
     */
    const loadUser = useCallback(async () => {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            setIsLoading(false);
            return;
        }

        setToken(storedToken);

        try {
            const userData = await userService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Failed to load user:', error);
            // Token je pravděpodobně neplatný
            removeToken();
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Načte uživatele při mount
     */
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    /**
     * Přihlášení uživatele
     */
    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            setToken(response.token);

            // Načíst uživatelská data
            const userData = await userService.getCurrentUser();
            setUser(userData);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Registrace uživatele
     */
    const register = useCallback(async (data: RegisterData) => {
        setIsLoading(true);
        try {
            await authService.register(data);
            // Po registraci automaticky přihlásit
            await login({
                username: data.username,
                password: data.password,
            });
        } finally {
            setIsLoading(false);
        }
    }, [login]);

    /**
     * Odhlášení uživatele
     */
    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setToken(null);
            setIsLoading(false);
        }
    }, []);

    /**
     * Aktualizace uživatelských dat
     */
    const refreshUser = useCallback(async () => {
        if (!token) return;

        try {
            const userData = await userService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    }, [token]);

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook pro použití AuthContext
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;
