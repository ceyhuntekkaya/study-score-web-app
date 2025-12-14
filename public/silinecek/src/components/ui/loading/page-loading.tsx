import "@/style.css";

export default function PageLoading() {
  return (
    <div className="page-loading-container">
      <div className="loading-content">
        {/* Logo */}
        <div className="loading-logo"></div>

        {/* Spinner */}
        <div className="loading-spinner"></div>

        {/* Loading Text */}
        <h2 className="loading-text">Loading...</h2>
        <p className="loading-subtitle">
          Content is being prepared, please wait
        </p>

        {/* Progress Bar */}
        <div className="loading-progress-container">
          <div className="loading-progress-bar"></div>
        </div>

        {/* Skeleton Content */}
        <div className="loading-skeleton loading-skeleton-header"></div>
        <div className="loading-skeleton loading-skeleton-line"></div>
        <div className="loading-skeleton loading-skeleton-line"></div>
        <div className="loading-skeleton loading-skeleton-line"></div>
        <div className="loading-skeleton loading-skeleton-line"></div>

        {/* Loading Dots */}
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
