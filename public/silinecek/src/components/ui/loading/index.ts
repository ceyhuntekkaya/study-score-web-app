// Loading Components
export { default as PageLoading } from "./page-loading";
export { default as SimpleLoading } from "./simple-loading";
export { default as InlineLoading } from "./inline-loading";
export { default as LoadingSpinner } from "./loading-spinner";
export { default as SkeletonLoading } from "./skeleton-loading";
export { default as LoadingDots } from "./loading-dots";

// Types
export type LoadingSpinnerSize = "sm" | "md" | "lg";
export type LoadingSpinnerColor = "primary" | "white" | "gray" | "custom";
export type LoadingDotsColor = "primary" | "white" | "gray";
export type LoadingTheme = "light" | "dark";

// CSS Classes for manual usage
// .page-loading-container - Full page loading container
// .loading-spinner - Spinning loader
// .loading-skeleton - Skeleton placeholder
// .btn-loading - Button loading state
// .inline-loading-light - Light theme wrapper
