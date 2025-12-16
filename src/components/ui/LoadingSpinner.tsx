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
        sm: 'spinner-border-sm',
        md: '',
        lg: 'spinner-border-lg'
    };

    const colorClasses = {
        primary: 'text-primary',
        white: 'text-white',
        gray: 'text-secondary'
    };

    return (
        <div 
            role="status" 
            className={`spinner-border ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
            aria-hidden="true"
        >
            <span className="visually-hidden">Loading...</span>
        </div>
    );
}
