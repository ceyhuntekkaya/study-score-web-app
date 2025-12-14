interface SkeletonLoadingProps {
  lines?: number;
  showHeader?: boolean;
  className?: string;
  theme?: "light" | "dark";
}

export default function SkeletonLoading({
  lines = 4,
  showHeader = true,
  className = "",
  theme = "light",
}: SkeletonLoadingProps) {
  const themeClass = theme === "dark" ? "skeleton-dark" : "skeleton-light";

  return (
    <div className={`skeleton-container ${themeClass} ${className}`}>
      {showHeader && (
        <div className="loading-skeleton loading-skeleton-header"></div>
      )}

      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className="loading-skeleton loading-skeleton-line"
          style={{
            width:
              index === lines - 1 ? "75%" : index % 2 === 0 ? "90%" : "100%",
          }}
        ></div>
      ))}
    </div>
  );
}
