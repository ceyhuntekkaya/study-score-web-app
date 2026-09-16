import type { User } from '@/types';

export function getDisplayName(user: User | null | undefined): string {
  if (!user?.name?.trim()) return 'Admin';
  return user.name.trim();
}

export function getInitials(user: User | null | undefined): string {
  const name = user?.name?.trim();
  if (!name) return 'A';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}
