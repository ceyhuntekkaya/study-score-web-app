/**
 * Utility function to merge class names
 * Similar to cn from shadcn/ui but simpler
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
    .trim();
}
