/**
 * Step 1: Basic Info Component
 * Collects: Title, Category, Short Teaser
 */

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CompleteProjectFormData } from '../../utils/wizardSchemas';
import { CATEGORY_OPTIONS } from '../../utils/wizardSchemas';

interface Step1BasicInfoProps {
    register: UseFormRegister<CompleteProjectFormData>;
    errors: FieldErrors<CompleteProjectFormData>;
    watchTitle?: string;
    watchTeaser?: string;
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
    register,
    errors,
    watchTitle = '',
    watchTeaser = '',
}) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-2">Project Basic Information</h2>
                <p className="text-gray-600">Let's start with the essentials of your project</p>
            </div>

            {/* Title Field */}
            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Title <span className="text-red-500">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    {...register('title')}
                    placeholder="e.g., Website for Animal Shelter"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.title
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-brand-blue focus:border-brand-blue'
                        }`}
                />
                <div className="flex justify-between items-center mt-1">
                    {errors.title && (
                        <p className="text-sm text-red-600 font-medium">{errors.title.message}</p>
                    )}
                    <p className={`text-sm ml-auto ${watchTitle.length > 100 ? 'text-red-600' : 'text-gray-500'}`}>
                        {watchTitle.length}/100
                    </p>
                </div>
            </div>

            {/* Category Field */}
            <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                </label>
                <select
                    id="category"
                    {...register('category')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white ${errors.category
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-brand-blue focus:border-brand-blue'
                        }`}
                >
                    <option value="">Select a category...</option>
                    {CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.category.message}</p>
                )}
            </div>

            {/* Teaser Field */}
            <div>
                <label htmlFor="teaser" className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Teaser <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-2">
                    A brief summary that will appear on the project card (1-2 sentences)
                </p>
                <textarea
                    id="teaser"
                    {...register('teaser')}
                    rows={3}
                    placeholder="e.g., Help create a modern website for a local animal shelter to showcase adoptable pets and increase adoption rates."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${errors.teaser
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-brand-blue focus:border-brand-blue'
                        }`}
                />
                <div className="flex justify-between items-center mt-1">
                    {errors.teaser && (
                        <p className="text-sm text-red-600 font-medium">{errors.teaser.message}</p>
                    )}
                    <p className={`text-sm ml-auto ${watchTeaser.length > 200 ? 'text-red-600' : 'text-gray-500'}`}>
                        {watchTeaser.length}/200
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step1BasicInfo;
