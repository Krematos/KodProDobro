import React, { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Card visual variant */
    variant?: 'default' | 'bordered' | 'elevated' | 'interactive';
    /** Padding size */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
    /** Card content */
    children: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

/**
 * Card Component
 * 
 * Reusable card component with multiple variants.
 * Supports composable sub-components: CardHeader, CardBody, CardFooter.
 * 
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <CardHeader>
 *     <h3>Card Title</h3>
 *   </CardHeader>
 *   <CardBody>
 *     <p>Card content goes here</p>
 *   </CardBody>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
const Card: React.FC<CardProps> & {
    Header: React.FC<CardHeaderProps>;
    Body: React.FC<CardBodyProps>;
    Footer: React.FC<CardFooterProps>;
} = ({ variant = 'default', padding = 'md', className = '', children, ...props }) => {
    // Base styles
    const baseStyles = 'bg-white rounded-xl overflow-hidden';

    // Variant styles
    const variantStyles = {
        default: 'border border-gray-200',
        bordered: 'border-2 border-gray-300',
        elevated: 'shadow-lg',
        interactive: 'shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer',
    };

    // Padding styles
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`.trim();

    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
};

/**
 * CardHeader Component
 * Header section of the card
 */
const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-200 ${className}`.trim()} {...props}>
            {children}
        </div>
    );
};

/**
 * CardBody Component
 * Main content section of the card
 */
const CardBody: React.FC<CardBodyProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-6 py-4 ${className}`.trim()} {...props}>
            {children}
        </div>
    );
};

/**
 * CardFooter Component
 * Footer section of the card
 */
const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-6 py-3 bg-gray-50 border-t border-gray-200 ${className}`.trim()} {...props}>
            {children}
        </div>
    );
};

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export default Card;
