/**
 * Step 4: Review & Submit Component
 * Displays: Read-only summary of all entered data
 */

import React from 'react';
import { CompleteProjectFormData } from '../../utils/wizardSchemas';
import { CATEGORY_OPTIONS, DIFFICULTY_OPTIONS } from '../../utils/wizardSchemas';
import { Edit2, CheckCircle } from 'lucide-react';

interface Step4ReviewProps {
    formData: CompleteProjectFormData;
    onEdit: (step: number) => void;
}

export const Step4Review: React.FC<Step4ReviewProps> = ({ formData, onEdit }) => {
    // Helper to get category label
    const getCategoryLabel = (value: string) => {
        return CATEGORY_OPTIONS.find((opt) => opt.value === value)?.label || value;
    };

    // Helper to get difficulty label
    const getDifficultyLabel = (value: string) => {
        return DIFFICULTY_OPTIONS.find((opt) => opt.value === value)?.label || value;
    };

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={28} className="text-accent-teal" />
                    <h2 className="text-2xl font-bold text-brand-dark">Review Your Project</h2>
                </div>
                <p className="text-gray-600">
                    Please review all the information before submitting. You can edit any section by clicking
                    the edit button.
                </p>
            </div>

            {/* Basic Info Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    <button
                        type="button"
                        onClick={() => onEdit(1)}
                        className="flex items-center gap-1 text-brand-blue hover:text-brand-blue/80 transition-colors"
                    >
                        <Edit2 size={16} />
                        <span className="text-sm font-medium">Edit</span>
                    </button>
                </div>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Title</p>
                        <p className="text-base text-gray-900">{formData.title}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Category</p>
                        <p className="text-base text-gray-900">{getCategoryLabel(formData.category)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Short Teaser</p>
                        <p className="text-base text-gray-900">{formData.teaser}</p>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
                    <button
                        type="button"
                        onClick={() => onEdit(2)}
                        className="flex items-center gap-1 text-brand-blue hover:text-brand-blue/80 transition-colors"
                    >
                        <Edit2 size={16} />
                        <span className="text-sm font-medium">Edit</span>
                    </button>
                </div>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-600 font-medium">Description</p>
                        <p className="text-base text-gray-900 whitespace-pre-wrap">{formData.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Difficulty Level</p>
                            <p className="text-base text-gray-900">{getDifficultyLabel(formData.difficulty)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Estimated Duration</p>
                            <p className="text-base text-gray-900">{formData.duration}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Required Skills</h3>
                    <button
                        type="button"
                        onClick={() => onEdit(3)}
                        className="flex items-center gap-1 text-brand-blue hover:text-brand-blue/80 transition-colors"
                    >
                        <Edit2 size={16} />
                        <span className="text-sm font-medium">Edit</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.requiredSkills.map((skill, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-sm font-medium border border-brand-blue/20"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-accent-teal/10 border border-accent-teal/30 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Note:</span> Once submitted, your project will be
                    reviewed and published on the KodProDobro platform. Students will be able to browse and
                    apply to work on your project.
                </p>
            </div>
        </div>
    );
};

export default Step4Review;
