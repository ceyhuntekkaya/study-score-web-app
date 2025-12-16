'use client';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white' | 'gray';
    className?: string;
}

export default function LoadingSpinner({
    size = 'md',
    color = 'primary',
    className = ''
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'ui-spinner-sm',
        md: 'ui-spinner-md',
        lg: 'ui-spinner-lg'
    };

    const colorStyles: React.CSSProperties = {
        color: color === 'primary' ? '#3b82f6' : 
               color === 'white' ? '#ffffff' : 
               '#6b7280'
    };

    return (
        <div 
            role="status" 
            className={`ui-spinner ${sizeClasses[size]} ${className}`}
            style={colorStyles}
            aria-hidden="true"
        >
            <span className="visually-hidden">Loading...</span>
        </div>
    );
}
