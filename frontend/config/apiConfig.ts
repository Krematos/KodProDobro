/**
 * Centrální konfigurace API endpointů a nastavení
 */

export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,

    endpoints: {
        auth: {
            login: '/api/auth/login',
            register: '/api/auth/register',
            logout: '/api/auth/logout',
            forgotPassword: '/api/auth/forgot-password',
            resetPassword: '/api/auth/reset-password',
        },
        users: {
            me: '/api/users/me',
            updateMe: '/api/users/me',
        },
        projects: {
            list: '/api/projects',
            detail: (id: string | number) => `/api/projects/${id}`,
            create: '/api/projects',
            update: (id: string | number) => `/api/projects/${id}`,
        },
        chats: {
            list: '/api/chats',
            messages: (id: string | number) => `/api/chats/${id}/messages`,
            sendMessage: (id: string | number) => `/api/chats/${id}/messages`,
        },
    },
} as const;

export default API_CONFIG;
