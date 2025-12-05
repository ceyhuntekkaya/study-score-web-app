import menusData from '@/data/menus.json';

export interface MenuItem {
  icon?: string;
  label?: string; // Fallback if labelKey is not provided
  labelKey?: string; // Translation key
  href: string;
  action?: string;
  hasDropdown?: boolean;
  submenu?: Array<{ label?: string; labelKey?: string; href: string }>;
  text?: string; // For top menu items
}

export interface SidebarSection {
  title?: string; // Fallback if titleKey is not provided
  titleKey?: string; // Translation key
  items: MenuItem[];
}

export interface SidebarMenu {
  sections: SidebarSection[];
}

export interface HeaderMenu {
  mainMenu: MenuItem[];
  userMenu?: {
    main: MenuItem[];
    secondary: MenuItem[];
  };
  topMenu?: {
    left?: Array<{ icon?: string; text?: string; href: string }>;
    right?: Array<{ label?: string; labelKey?: string; href: string }>;
  };
}

export interface LessonItem {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration?: string;
  completed: boolean;
}

export interface LessonSection {
  id: string;
  title: string;
  completedCount: number;
  totalCount: number;
  lessons: LessonItem[];
}

/**
 * Get sidebar menu for a specific role
 */
export function getSidebarMenu(role: 'learner' | 'tutor' | 'manager'): SidebarMenu {
  return menusData.sidebars[role];
}

/**
 * Get header menu for a specific role
 */
export function getHeaderMenu(role: 'public' | 'learner' | 'tutor' | 'manager'): HeaderMenu {
  return menusData.headers[role];
}

/**
 * Get lesson sidebar menu
 */
export function getLessonSidebarMenu(): { sections: LessonSection[] } {
  return menusData.lessonSidebar;
}

