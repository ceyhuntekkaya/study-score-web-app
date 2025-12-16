'use client';

interface LoadingDotsProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'white' | 'gray';
    enhanced?: boolean;
    className?: string;
}

export default function LoadingDots({
    size = 'md',
    color = 'white',
    enhanced = false,
    className = '',
}: LoadingDotsProps) {
    const sizeClasses = {
        sm: 'gap-1',
        md: 'gap-2',
        lg: 'gap-3',
    };

    const dotSizeClasses = {
        sm: { width: '6px', height: '6px' },
        md: { width: '8px', height: '8px' },
        lg: { width: '12px', height: '12px' },
    };

    const colorClasses = {
        primary: 'bg-primary',
        white: 'bg-white',
        gray: 'bg-secondary',
    };

    return (
        <div className={`d-flex ${sizeClasses[size]} ${className}`}>
            <div
                className={`rounded-circle ${colorClasses[color]}`}
                style={{
                    ...dotSizeClasses[size],
                    animation: 'loading-dot-1 1.4s infinite ease-in-out'
                }}
            ></div>
            <div
                className={`rounded-circle ${colorClasses[color]}`}
                style={{
                    ...dotSizeClasses[size],
                    animation: 'loading-dot-2 1.4s infinite ease-in-out'
                }}
            ></div>
            <div
                className={`rounded-circle ${colorClasses[color]}`}
                style={{
                    ...dotSizeClasses[size],
                    animation: 'loading-dot-3 1.4s infinite ease-in-out'
                }}
            ></div>
        </div>
    );
}
