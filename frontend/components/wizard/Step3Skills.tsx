/**
 * Step 2: Details Component
 * Collects: Description, Difficulty Level, Estimated Duration
 */

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CompleteProjectFormData } from '../../utils/wizardSchemas';
import { DIFFICULTY_OPTIONS } from '../../utils/wizardSchemas';
import { Info } from 'lucide-react';

interface Step2DetailsProps {
    register: UseFormRegister<CompleteProjectFormData>;
    errors: FieldErrors<CompleteProjectFormData>;
    watchDescription?: string;
}

export const Step2Details: React.FC<Step2DetailsProps> = ({
    register,
    errors,
    watchDescription = '',
}) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-2">Project Details</h2>
                <p className="text-gray-600">Provide detailed information about your project requirements</p>
            </div>

            {/* Description Field */}
            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Description <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-2 flex items-start gap-2">
                    <Info size={16} className="mt-0.5 flex-shrink-0 text-brand-blue" />
                    <span>
                        Describe the project in detail. Include objectives, scope, expected outcomes, and any
                        specific requirements or constraints. Minimum 50 characters.
                    </span>
                </p>
                <textarea
                    id="description"
                    {...register('description')}
                    rows={8}
                    placeholder="Example: We need a modern, responsive website for our animal shelter. The site should feature:&#10;- Homepage with mission statement and featured pets&#10;- Searchable database of adoptable animals&#10;- Online adoption application form&#10;- Volunteer registration&#10;- Donation integration&#10;&#10;The design should be warm, inviting, and mobile-friendly..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${errors.description
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-brand-blue focus:border-brand-blue'
                        }`}
                />
                <div className="flex justify-between items-center mt-1">
                    {errors.description && (
                        <p className="text-sm text-red-600 font-medium">{errors.description.message}</p>
                    )}
                    <p className={`text-sm ml-auto ${watchDescription.length < 50
                            ? 'text-orange-600'
                            : watchDescription.length > 5000
                                ? 'text-red-600'
                                : 'text-gray-500'
                        }`}>
                        {watchDescription.length}/5000 {watchDescription.length < 50 && `(min. 50)`}
                    </p>
                </div>
            </div>

            {/* Difficulty Level Field */}
            <div>
                <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty Level <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">
                    Select the experience level required for students to successfully complete this project
                </p>
                <div className="space-y-3">
                    {DIFFICULTY_OPTIONS.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-brand-blue hover:bg-brand-blue/5 ${errors.difficulty ? 'border-red-300' : 'border-gray-200'
                                }`}
                        >
                            <input
                                type="radio"
                                {...register('difficulty')}
                                value={option.value}
                                className="mt-1 w-4 h-4 text-brand-blue focus:ring-brand-blue"
                            />
                            <div className="ml-3">
                                <div className="font-semibold text-gray-900">{option.label}</div>
                                <div className="text-sm text-gray-600">{option.description}</div>
                            </div>
                        </label>
                    ))}
                </div>
                {errors.difficulty && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.difficulty.message}</p>
                )}
            </div>

            {/* Duration Field */}
            <div>
                <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimated Duration <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-2">
                    How long do you estimate this project will take to complete?
                </p>
                <input
                    id="duration"
                    type="text"
                    {...register('duration')}
                    placeholder='e.g., "2 weeks", "1 month", "3-4 weeks"'
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.duration
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-brand-blue focus:border-brand-blue'
                        }`}
                />
                {errors.duration && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.duration.message}</p>
                )}
            </div>
        </div>
    );
};

export default Step2Details;
