/**
 * Uživatelská služba pro komunikaci s backend API
 */

import { apiClient } from '../utils/apiClient';
import API_CONFIG from '../config/apiConfig';

import type { User } from '../types';

export type BackendUser = User;


export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    email?: string;
}

/**
 * Parsuje textový response z /api/users/me
 * Backend vrací: "Přihlášený uživatel: User(id=1, username=jana.novakova, ...)"
 */
const parseUserFromText = (text: string): BackendUser => {
    // Regex pro extrakci dat z textu
    const idMatch = text.match(/id=(\d+)/);
    const usernameMatch = text.match(/username=([^,\s]+)/);
    const emailMatch = text.match(/email=([^,\s]+)/);
    const firstNameMatch = text.match(/firstName=([^,\s)]+)/);
    const lastNameMatch = text.match(/lastName=([^,\s)]+)/);
    const roleMatch = text.match(/role=([^,\s)]+)/);

    if (!idMatch || !usernameMatch || !emailMatch) {
        throw new Error('Failed to parse user data from response');
    }

    return {
        id: parseInt(idMatch[1]),
        username: usernameMatch[1],
        email: emailMatch[1],
        firstName: firstNameMatch ? firstNameMatch[1] : undefined,
        lastName: lastNameMatch ? lastNameMatch[1] : undefined,
        role: roleMatch ? roleMatch[1] : 'STUDENT',
    };
};

/**
 * Získá aktuálně přihlášeného uživatele
 */
export const getCurrentUser = async (): Promise<BackendUser> => {
    const response = await apiClient.get<string>(API_CONFIG.endpoints.users.me);

    // Backend aktuálně vrací text místo JSON
    if (typeof response === 'string') {
        return parseUserFromText(response);
    }

    // Pokud backend přejde na JSON
    return response as unknown as BackendUser;
};

/**
 * Aktualizace profilu uživatele
 */
export const updateProfile = async (data: UpdateUserData): Promise<BackendUser> => {
    const response = await apiClient.put<BackendUser>(
        API_CONFIG.endpoints.users.updateMe,
        data
    );

    return response;
};

const userService = {
    getCurrentUser,
    updateProfile,
};

export default userService;
