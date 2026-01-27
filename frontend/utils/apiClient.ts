/**
 * HTTP klient pro API komunikaci s automatickým přidáváním JWT tokenu
 * a centralizovaným error handlingem
 */

import API_CONFIG from '../config/apiConfig';

export interface ApiError {
    message: string;
    status?: number;
    data?: any;
}

export class ApiClientError extends Error {
    status?: number;
    data?: any;

    constructor(message: string, status?: number, data?: any) {
        super(message);
        this.name = 'ApiClientError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Získá JWT token z localStorage
 */
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

/**
 * Uloží JWT token do localStorage
 */
export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

/**
 * Odstraní JWT token z localStorage
 */
export const removeToken = (): void => {
    localStorage.removeItem('token');
};

/**
 * Generická metoda pro HTTP požadavky
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const token = getToken();

    // Defaultní headers
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Přidat Authorization header pokud existuje token
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        const response = await fetch(url, {
            ...config,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Zpracování odpovědi
        if (!response.ok) {
            let errorData;
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
            } else {
                errorData = await response.text();
            }

            throw new ApiClientError(
                errorData.message || errorData.error || errorData || 'Nastala chyba při komunikaci se serverem',
                response.status,
                errorData
            );
        }

        // Pokud je odpověď prázdná (204 No Content)
        if (response.status === 204) {
            return {} as T;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            // Pro non-JSON odpovědi (například /api/users/me vrací text)
            const text = await response.text();
            return text as unknown as T;
        }
    } catch (error) {
        if (error instanceof ApiClientError) {
            throw error;
        }

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new ApiClientError('Požadavek vypršel', 408);
            }
            throw new ApiClientError(error.message);
        }

        throw new ApiClientError('Neznámá chyba');
    }
}

/**
 * HTTP metody
 */
export const apiClient = {
    get: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> =>
        request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> =>
        request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T>(endpoint: string, options?: RequestInit): Promise<T> =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),

    patch: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> =>
        request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),
};

export default apiClient;
