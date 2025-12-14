interface InlineLoadingProps {
  text?: string;
  size?: "small" | "medium" | "large";
  showSkeleton?: boolean;
}

export default function InlineLoading({
  text = "Loading...",
  size = "medium",
  showSkeleton = false,
}: InlineLoadingProps) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <div className="inline-loading-container">
      <div className="inline-loading-content">
        {/* Spinner */}
        <div className={`inline-loading-spinner ${sizeClasses[size]}`}></div>

        {/* Loading Text */}
        <p className={`inline-loading-text ${textSizeClasses[size]}`}>{text}</p>

        {/* Optional Skeleton */}
        {showSkeleton && (
          <div className="inline-loading-skeleton-container">
            <div
              className="loading-skeleton loading-skeleton-line"
              style={{ width: "80%", height: "12px" }}
            ></div>
            <div
              className="loading-skeleton loading-skeleton-line"
              style={{ width: "100%", height: "12px" }}
            ></div>
            <div
              className="loading-skeleton loading-skeleton-line"
              style={{ width: "60%", height: "12px" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
