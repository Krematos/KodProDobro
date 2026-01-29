import React, { forwardRef, ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button visual variant */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Loading state - shows spinner and disables button */
    isLoading?: boolean;
    /** Full width button */
    fullWidth?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Button Component
 * 
 * Reusable button component with multiple variants and sizes.
 * Supports loading state, disabled state, and custom styling.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            fullWidth = false,
            className = '',
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        // Base styles
        const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

        // Variant styles
        const variantStyles = {
            primary: 'bg-brand-blue text-white hover:bg-opacity-90 focus:ring-brand-blue shadow-md hover:shadow-lg',
            secondary: 'bg-accent-teal text-white hover:bg-opacity-90 focus:ring-accent-teal shadow-md hover:shadow-lg',
            outline: 'bg-transparent border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white focus:ring-brand-blue',
            ghost: 'bg-transparent text-brand-blue hover:bg-brand-light focus:ring-brand-blue',
            danger: 'bg-brand-red text-white hover:bg-opacity-90 focus:ring-brand-red shadow-md hover:shadow-lg',
        };

        // Size styles
        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        // Full width
        const widthStyles = fullWidth ? 'w-full' : '';

        const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`.trim();

        return (
            <button
                ref={ref}
                className={combinedClassName}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
