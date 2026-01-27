/**
 * Zod validation schemas for Create Project Wizard
 */

import { z } from 'zod';

// Enum definitions matching backend expectations
export const CategoryEnum = z.enum(['WEB', 'MOBILE', 'MARKETING', 'GRAPHIC_DESIGN']);

export const DifficultyEnum = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']);

// Step 1: Basic Info Schema
export const step1Schema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title must not exceed 100 characters')
        .trim(),
    category: CategoryEnum,
    teaser: z
        .string()
        .min(1, 'Short teaser is required')
        .max(200, 'Teaser must not exceed 200 characters')
        .trim(),
});

// Step 2: Details Schema
export const step2Schema = z.object({
    description: z
        .string()
        .min(50, 'Description must be at least 50 characters')
        .max(5000, 'Description must not exceed 5000 characters')
        .trim(),
    difficulty: DifficultyEnum,
    duration: z
        .string()
        .min(1, 'Estimated duration is required')
        .max(50, 'Duration must not exceed 50 characters')
        .trim(),
});

// Step 3: Skills Schema
export const step3Schema = z.object({
    requiredSkills: z
        .array(z.string().min(1).max(50))
        .min(1, 'At least one skill is required')
        .max(20, 'Maximum 20 skills allowed'),
});

// Complete form schema (all steps combined)
export const completeProjectSchema = step1Schema.merge(step2Schema).merge(step3Schema);

// TypeScript types derived from schemas
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type CompleteProjectFormData = z.infer<typeof completeProjectSchema>;

// Helper type for category options
export const CATEGORY_OPTIONS = [
    { value: 'WEB', label: 'Web Development' },
    { value: 'MOBILE', label: 'Mobile Development' },
    { value: 'MARKETING', label: 'Marketing & Social Media' },
    { value: 'GRAPHIC_DESIGN', label: 'Graphic Design' },
] as const;

// Helper type for difficulty options
export const DIFFICULTY_OPTIONS = [
    { value: 'BEGINNER', label: 'Beginner', description: 'Suitable for students new to the field' },
    { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Requires some experience' },
    { value: 'ADVANCED', label: 'Advanced', description: 'For experienced developers' },
] as const;
