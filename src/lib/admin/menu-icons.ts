import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Building,
  Calendar,
  FileText,
  HelpCircle,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';

const FEATHER_TO_LUCIDE: Record<string, LucideIcon> = {
  'feather-home': Home,
  'feather-building': Building,
  'feather-book-open': BookOpen,
  'feather-file-text': FileText,
  'feather-layers': Layers,
  'feather-help-circle': HelpCircle,
  'feather-users': Users,
  'feather-calendar': Calendar,
  'feather-settings': Settings,
  'feather-log-out': LogOut,
};

export function getAdminMenuIcon(featherClass?: string): LucideIcon {
  if (!featherClass) return LayoutDashboard;
  return FEATHER_TO_LUCIDE[featherClass] ?? LayoutDashboard;
}
