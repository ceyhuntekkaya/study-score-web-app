interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray" | "custom";
  className?: string;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

const colorClasses = {
  primary: "border-[#0a2e5e] border-t-white",
  white: "border-white/20 border-t-white",
  gray: "border-gray-300 border-t-gray-600",
  custom: "border-white/20 border-t-white", // Varsayılan olarak beyaz tema
};

export default function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div role="status" className={`inline-loading-spinner ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          border-4 
          rounded-full 
          animate-spin
        `}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
