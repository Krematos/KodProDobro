import { useQuery } from '@tanstack/react-query';
import projectService from '../services/projectService';
import { mapBackendProjectsToFrontend } from '../utils/mappers';

/**
 * Hook pro načtení detailu projektu podle ID
 * 
 * @param id - ID projektu
 * 
 * @example
 * ```tsx
 * const { data: project, isLoading, error } = useProject(projectId);
 * ```
 */
export const useProject = (id: string | number | undefined) => {
    return useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            if (!id) throw new Error('Project ID is required');
            const backendProject = await projectService.getProjectById(id);
            const [frontendProject] = mapBackendProjectsToFrontend([backendProject]);
            return frontendProject;
        },
        enabled: !!id, // Spustit jen pokud máme ID
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
