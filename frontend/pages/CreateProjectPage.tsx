/**
 * CreateProjectPage - Page wrapper for the Create Project Wizard
 * Provides layout and context for the wizard component
 */

import React from 'react';
import CreateProjectWizard from '../components/CreateProjectWizard';
import { ArrowLeft } from 'lucide-react';

interface CreateProjectPageProps {
    onBack: () => void;
}

export const CreateProjectPage: React.FC<CreateProjectPageProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-brand-light">
            {/* Header with back button */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-brand-blue transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Back to Projects</span>
                        </button>
                        <div className="h-6 w-px bg-gray-300" />
                        <h1 className="text-xl font-bold text-brand-dark">Create New Project</h1>
                    </div>
                </div>
            </div>

            {/* Wizard Content */}
            <CreateProjectWizard />
        </div>
    );
};

export default CreateProjectPage;
