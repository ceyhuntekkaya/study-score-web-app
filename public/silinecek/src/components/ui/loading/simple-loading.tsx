export default function SimpleLoading() {
  return (
    <div className="page-loading-container">
      <div className="loading-content">
        {/* Logo */}
        <div className="loading-logo"></div>

        {/* Spinner */}
        <div className="loading-spinner"></div>

        {/* Loading Text */}
        <h2 className="loading-text">Loading...</h2>

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
