/**
 * Autentizační služba pro komunikaci s backend API
 */

import { apiClient, setToken, removeToken } from '../utils/apiClient';
import API_CONFIG from '../config/apiConfig';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    roles?: string[];
}

export interface AuthResponse {
    token: string;
    username: string;
    roles: Array<{ authority: string }>;
}

export interface MessageResponse {
    message: string;
}

/**
 * Přihlášení uživatele
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
        API_CONFIG.endpoints.auth.login,
        credentials
    );

    // Uložit token do localStorage
    setToken(response.token);

    return response;
};

/**
 * Registrace nového uživatele
 */
export const register = async (data: RegisterData): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
        API_CONFIG.endpoints.auth.register,
        {
            ...data,
            roles: data.roles || ['STUDENT'], // Default role
        }
    );

    return response;
};

/**
 * Odhlášení uživatele
 */
export const logout = async (): Promise<void> => {
    try {
        await apiClient.post<MessageResponse>(API_CONFIG.endpoints.auth.logout);
    } catch (error) {
        // I když API selže, odhlásíme uživatele lokálně
        console.error('Logout API error:', error);
    } finally {
        // Vždy odstranit token z localStorage
        removeToken();
    }
};

/**
 * Žádost o reset hesla
 */
export const forgotPassword = async (email: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
        API_CONFIG.endpoints.auth.forgotPassword,
        { email }
    );

    return response;
};

/**
 * Reset hesla pomocí tokenu
 */
export const resetPassword = async (
    token: string,
    newPassword: string
): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>(
        API_CONFIG.endpoints.auth.resetPassword,
        { token, newPassword }
    );

    return response;
};

const authService = {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
};

export default authService;
