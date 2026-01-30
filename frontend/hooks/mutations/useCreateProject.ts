import { useMutation, useQueryClient } from '@tanstack/react-query';
import projectService, { CreateProjectData } from '../services/projectService';
import { useNavigate } from 'react-router-dom';

/**
 * Hook pro vytvoření nového projektu
 * 
 * Automaticky invaliduje projects query po úspěchu.
 * 
 * @example
 * ```tsx
 * const { mutate: createProject, isPending } = useCreateProject();
 * 
 * createProject(projectData, {
 *   onSuccess: (newProject) => {
 *     console.log('Created:', newProject);
 *   }
 * });
 * ```
 */
export const useCreateProject = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: CreateProjectData) => projectService.createProject(data),
        onSuccess: (newProject) => {
            // Invalidate projects list aby se refetchlo
            queryClient.invalidateQueries({ queryKey: ['projects'] });

            // Navigate na detail nového projektu
            navigate(`/projects/${newProject.id}`);
        },
    });
};
