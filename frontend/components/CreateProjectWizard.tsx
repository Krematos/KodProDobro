/**
 * CreateProjectWizard - Main wizard orchestrator component
 * Manages multi-step form state, validation, navigation, and API submission
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CompleteProjectFormData,
    step1Schema,
    step2Schema,
    step3Schema,
    completeProjectSchema,
} from '../utils/wizardSchemas';
import { createProject, CreateProjectData } from '../services/projectService';
import WizardProgressBar from './WizardProgressBar';
import Step1BasicInfo from './wizard/Step1BasicInfo';
import Step2Details from './wizard/Step2Details';
import Step3Skills from './wizard/Step3Skills';
import Step4Review from './wizard/Step4Review';
import LoadingSpinner from './LoadingSpinner';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

const STEP_LABELS = ['Basic Info', 'Details', 'Skills', 'Review'];
const TOTAL_STEPS = 4;

interface CreateProjectWizardProps {
    onSuccess?: () => void;
}

export const CreateProjectWizard: React.FC<CreateProjectWizardProps> = ({ onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');

    // Initialize react-hook-form with Zod validation
    const {
        register,
        handleSubmit,
        control,
        watch,
        trigger,
        getValues,
        formState: { errors },
    } = useForm<CompleteProjectFormData>({
        resolver: zodResolver(completeProjectSchema),
        mode: 'onChange',
    });

    // Watch fields for character counters and review
    const watchTitle = watch('title', '');
    const watchTeaser = watch('teaser', '');
    const watchDescription = watch('description', '');

    /**
     * Validate current step before proceeding
     */
    const validateCurrentStep = async (): Promise<boolean> => {
        let fieldsToValidate: (keyof CompleteProjectFormData)[] = [];

        switch (currentStep) {
            case 1:
                fieldsToValidate = ['title', 'category', 'teaser'];
                break;
            case 2:
                fieldsToValidate = ['description', 'difficulty', 'duration'];
                break;
            case 3:
                fieldsToValidate = ['requiredSkills'];
                break;
            default:
                return true;
        }

        const result = await trigger(fieldsToValidate);
        return result;
    };

    /**
     * Handle Next button click
     */
    const handleNext = async () => {
        const isValid = await validateCurrentStep();
        if (isValid && currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
            setSubmitError('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /**
     * Handle Back button click
     */
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setSubmitError('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /**
     * Handle Edit button click from review step
     */
    const handleEdit = (step: number) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Handle final form submission
     */
    const onSubmit = async (data: CompleteProjectFormData) => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Prepare payload matching backend API structure
            const projectData: CreateProjectData = {
                title: data.title,
                category: data.category,
                description: data.description,
                difficulty: data.difficulty,
                duration: data.duration,
                requiredSkills: data.requiredSkills,
            };

            // Submit to API
            const createdProject = await createProject(projectData);

            // Success! Call the success callback
            console.log('Project created successfully:', createdProject);

            if (onSuccess) {
                onSuccess();
            }

        } catch (error: any) {
            console.error('Error creating project:', error);
            setSubmitError(
                error.message || 'Failed to create project. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Render current step
     */
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1BasicInfo
                        register={register}
                        errors={errors}
                        watchTitle={watchTitle}
                        watchTeaser={watchTeaser}
                    />
                );
            case 2:
                return (
                    <Step2Details
                        register={register}
                        errors={errors}
                        watchDescription={watchDescription}
                    />
                );
            case 3:
                return <Step3Skills control={control} errors={errors} />;
            case 4:
                return <Step4Review formData={getValues()} onEdit={handleEdit} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-brand-light py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <WizardProgressBar
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    stepLabels={STEP_LABELS}
                />

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8">
                    {/* Step Content */}
                    <div className="mb-8">{renderStep()}</div>

                    {/* Error Message */}
                    {submitError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm font-medium">{submitError}</p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={currentStep === 1 || isSubmitting}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${currentStep === 1 || isSubmitting
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            <ChevronLeft size={20} />
                            Back
                        </button>

                        {/* Next / Submit Button */}
                        {currentStep < TOTAL_STEPS ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-teal to-brand-blue text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingSpinner />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        <span>Submit Project</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>

                {/* Help Text */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Need help? Contact us at{' '}
                    <a href="mailto:support@kodprodobro.cz" className="text-brand-blue hover:underline">
                        support@kodprodobro.cz
                    </a>
                </p>
            </div>
        </div>
    );
};

export default CreateProjectWizard;
