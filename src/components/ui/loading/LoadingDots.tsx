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
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const colorClasses = {
    primary: 'bg-[#0a2e5e]',
    white: 'bg-white',
    gray: 'bg-gray-400',
  };

  const containerClass = enhanced ? 'loading-dots-enhanced' : 'loading-dots';

  return (
    <div className={`${containerClass} flex ${sizeClasses[size]} ${className}`}>
      <div
        className={`
          ${dotSizeClasses[size]} 
          ${colorClasses[color]}
          rounded-full loading-dot-1
        `}
      ></div>
      <div
        className={`
          ${dotSizeClasses[size]} 
          ${colorClasses[color]}
          rounded-full loading-dot-2
        `}
      ></div>
      <div
        className={`
          ${dotSizeClasses[size]} 
          ${colorClasses[color]}
          rounded-full loading-dot-3
        `}
      ></div>
    </div>
  );
}
