/**
 * WizardProgressBar Component - Visual progress indicator for multi-step wizard
 */

import React from 'react';
import { Check } from 'lucide-react';

interface WizardProgressBarProps {
    currentStep: number;
    totalSteps: number;
    stepLabels?: string[];
}

export const WizardProgressBar: React.FC<WizardProgressBarProps> = ({
    currentStep,
    totalSteps,
    stepLabels = [],
}) => {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="w-full mb-8">
            {/* Progress Bar */}
            <div className="relative">
                {/* Background Bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    {/* Active Progress */}
                    <div
                        className="h-full bg-gradient-to-r from-brand-blue to-accent-teal transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Step Indicators */}
                <div className="absolute top-0 left-0 w-full flex justify-between items-center -translate-y-1/2">
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
                        const isCompleted = step < currentStep;
                        const isCurrent = step === currentStep;

                        return (
                            <div
                                key={step}
                                className="flex flex-col items-center"
                                style={{ marginLeft: step === 1 ? '0' : 'auto', marginRight: step === totalSteps ? '0' : 'auto' }}
                            >
                                {/* Circle Indicator */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${isCompleted
                                            ? 'bg-brand-blue text-white shadow-lg'
                                            : isCurrent
                                                ? 'bg-accent-teal text-white shadow-lg ring-4 ring-accent-teal/30'
                                                : 'bg-white border-2 border-gray-300 text-gray-400'
                                        }`}
                                >
                                    {isCompleted ? <Check size={16} /> : step}
                                </div>

                                {/* Step Label */}
                                {stepLabels[step - 1] && (
                                    <span
                                        className={`mt-2 text-xs font-medium transition-colors ${isCurrent
                                                ? 'text-brand-blue'
                                                : isCompleted
                                                    ? 'text-gray-700'
                                                    : 'text-gray-400'
                                            }`}
                                    >
                                        {stepLabels[step - 1]}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current Step Label */}
            <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                    Step {currentStep} of {totalSteps}
                </p>
            </div>
        </div>
    );
};

export default WizardProgressBar;
