import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Input visual variant */
    variant?: 'default' | 'error' | 'success';
    /** Input size */
    inputSize?: 'sm' | 'md' | 'lg';
    /** Label text */
    label?: string;
    /** Helper text shown below input */
    helperText?: string;
    /** Error message - automatically sets variant to 'error' */
    error?: string;
    /** Icon to display on left side */
    leftIcon?: ReactNode;
    /** Icon to display on right side */
    rightIcon?: ReactNode;
    /** Full width input */
    fullWidth?: boolean;
    /** Additional CSS classes for the input element */
    className?: string;
    /** Additional CSS classes for the wrapper */
    wrapperClassName?: string;
}

/**
 * Input Component
 * 
 * Reusable input component with label, helper text, error states, and icons.
 * Supports various input types and sizes.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={errors.email}
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            variant = 'default',
            inputSize = 'md',
            label,
            helperText,
            error,
            leftIcon,
            rightIcon,
            fullWidth = true,
            className = '',
            wrapperClassName = '',
            ...props
        },
        ref
    ) => {
        // Automatically set variant to error if error prop is provided
        const effectiveVariant = error ? 'error' : variant;

        // Base input styles
        const baseStyles = 'rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed';

        // Variant styles
        const variantStyles = {
            default: 'border-gray-300 focus:border-brand-blue focus:ring-brand-blue',
            error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
            success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
        };

        // Size styles
        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-3 py-2 text-base',
            lg: 'px-4 py-3 text-lg',
        };

        // Icon padding adjustments
        const leftIconPadding = leftIcon ? 'pl-10' : '';
        const rightIconPadding = rightIcon ? 'pr-10' : '';

        // Width
        const widthStyles = fullWidth ? 'w-full' : '';

        const inputClassName = `${baseStyles} ${variantStyles[effectiveVariant]} ${sizeStyles[inputSize]} ${leftIconPadding} ${rightIconPadding} ${widthStyles} ${className}`.trim();

        return (
            <div className={`${fullWidth ? 'w-full' : ''} ${wrapperClassName}`.trim()}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={inputClassName}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {(error || helperText) && (
                    <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
