import { useQuery } from '@tanstack/react-query';
import projectService from '../services/projectService';
import { mapBackendProjectsToFrontend } from '../utils/mappers';

/**
 * Hook pro načtení seznamu všech projektů
 * 
 * Automaticky cachuje data a refetch při focus.
 * 
 * @example
 * ```tsx
 * const { data: projects, isLoading, error } = useProjects();
 * ```
 */
export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const backendProjects = await projectService.getProjects();
            return mapBackendProjectsToFrontend(backendProjects);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
