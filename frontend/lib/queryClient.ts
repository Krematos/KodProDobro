import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client Configuration
 * 
 * Centrální konfigurace pro všechny queries a mutations.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache data po dobu 5 minut
            staleTime: 5 * 60 * 1000,

            // Refetch data při focus na okno
            refetchOnWindowFocus: true,

            // Retry failed requests
            retry: 1,

            // Refetch při reconnect
            refetchOnReconnect: true,
        },
        mutations: {
            // Retry mutations jen jednou
            retry: 1,
        },
    },
});
