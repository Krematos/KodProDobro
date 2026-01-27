/**
 * Projektová služba pro komunikaci s backend API
 */

import { apiClient } from '../utils/apiClient';
import API_CONFIG from '../config/apiConfig';

import type { Project } from '../types';

export type BackendProject = Project;


export interface CreateProjectData {
    title: string;
    category: 'WEB' | 'MOBILE' | 'MARKETING' | 'GRAPHIC_DESIGN';
    description: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    duration: string;
    requiredSkills: string[];
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
}

/**
 * Získá seznam všech projektů
 */
export const getProjects = async (): Promise<BackendProject[]> => {
    const response = await apiClient.get<BackendProject[]>(
        API_CONFIG.endpoints.projects.list
    );

    return response;
};

/**
 * Získá detail konkrétního projektu
 */
export const getProjectById = async (id: string | number): Promise<BackendProject> => {
    const response = await apiClient.get<BackendProject>(
        API_CONFIG.endpoints.projects.detail(id)
    );

    return response;
};

/**
 * Vytvoří nový projekt (vyžaduje NONPROFIT roli)
 */
export const createProject = async (data: CreateProjectData): Promise<BackendProject> => {
    // Mapujeme frontend data na backend API
    const payload = {
        name: data.title,
        description: data.description,
        // Backend zatím nepodporuje tyto pole, ale posíláme je pro budoucí rozšíření
        // nebo pokud je backend začne podporovat.
        // V současné době API dokumentace zmiňuje jen 'name' a 'description'.
        // Pokud je backend striktní, možná budeme muset tyto pole odstranit.
        // Prozatím předpokládáme, že ignoruje neznámé pole.
        category: data.category,
        difficulty: data.difficulty,
        duration: data.duration,
        requiredSkills: data.requiredSkills
    };

    const response = await apiClient.post<BackendProject>(
        API_CONFIG.endpoints.projects.create,
        payload
    );

    return response;
};

/**
 * Aktualizuje existující projekt (vyžaduje NONPROFIT roli)
 */
export const updateProject = async (
    id: string | number,
    data: UpdateProjectData
): Promise<BackendProject> => {
    const response = await apiClient.put<BackendProject>(
        API_CONFIG.endpoints.projects.update(id),
        data
    );

    return response;
};

const projectService = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
};

export default projectService;
