/**
 * Data mappers - transformace dat z backendu na frontend formát
 */

import type { Organization, Project, User } from '../types';
import type { BackendProject } from '../services/projectService';
import type { BackendUser } from '../services/userService';

/**
 * Mapuje backend uživatele na frontend formát
 */
export const mapBackendUserToFrontend = (backendUser: BackendUser): User => {
    const fullName = backendUser.firstName && backendUser.lastName
        ? `${backendUser.firstName} ${backendUser.lastName}`
        : backendUser.username;

    // Generovat avatar URL z Gravatar nebo použít placeholder
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00529B&color=fff&size=200`;

    return {
        id: backendUser.id.toString(),
        name: fullName,
        avatarUrl,
        // Tyto field nejsou v backendu - použijeme mock hodnoty nebo prázdné
        university: '', // TODO: Backend by měl poskytnout
        fieldOfStudy: '', // TODO: Backend by měl poskytnout
        skills: [], // TODO: Backend by měl poskytnout
        bio: '', // TODO: Backend by měl poskytnout
        portfolio: [], // Načítá se samostatně z projektů
        interests: [], // TODO: Backend by měl poskytnout
        // Gamifikace - mock dokud není v backendu
        xp: 0,
        level: 1,
        contributionStreak: 0,
        totalImpact: 0,
    };
};

/**
 * Mapuje backend projekt owner na frontend organizaci
 */
export const mapOwnerToOrganization = (owner: BackendProject['owner']): Organization => {
    const fullName = owner.firstName && owner.lastName
        ? `${owner.firstName} ${owner.lastName}`
        : owner.username;

    return {
        id: owner.id.toString(),
        name: fullName,
        logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=D80027&color=fff&size=100`,
        description: '', // TODO: Backend by měl poskytnout
        website: '', // TODO: Backend by měl poskytnout
        isCommunityChampion: false, // TODO: Backend by měl poskytnout
        projectsPosted: 0, // TODO: Backend by měl poskytnout
    };
};

/**
 * Mapuje backend projekt na frontend formát
 */
export const mapBackendProjectToFrontend = (backendProject: BackendProject): Project => {
    // Zkrátit description na summary (prvních 150 znaků)
    const summary = backendProject.description
        ? backendProject.description.substring(0, 150) + (backendProject.description.length > 150 ? '...' : '')
        : '';

    return {
        id: backendProject.id.toString(),
        title: backendProject.name,
        organization: mapOwnerToOrganization(backendProject.owner),
        summary,
        description: backendProject.description || '',
        // Tyto fields nejsou v backendu - mock hodnoty
        requiredSkills: [], // TODO: Backend by měl poskytnout
        timeline: '', // TODO: Backend by měl poskytnout
        commitment: '', // TODO: Backend by měl poskytnout
        deliverables: [], // TODO: Backend by měl poskytnout
        status: 'Open', // TODO: Backend by měl poskytnout status
        tags: [], // TODO: Backend by měl poskytnout
        impactScore: 0, // TODO: Backend by měl poskytnout
        highlight: undefined, // TODO: Backend by měl poskytnout
    };
};

/**
 * Mapuje pole backend projektů na frontend formát
 */
export const mapBackendProjectsToFrontend = (backendProjects: BackendProject[]): Project[] => {
    return backendProjects.map(mapBackendProjectToFrontend);
};
