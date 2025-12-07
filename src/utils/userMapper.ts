/**
 * User Mapper Utility
 * Maps generated API User type to local User type
 */

import { User as LocalUser, UserRole } from '@/types';
import { User as GeneratedUser, UserRoleSetItem } from '@/generated/api/openAPIDefinition.schemas';

/**
 * Maps backend UserRoleSetItem to frontend UserRole
 */
function mapRole(roleSet?: UserRoleSetItem[]): UserRole {
  if (!roleSet || roleSet.length === 0) {
    return 'learner'; // Default role
  }

  // Get the first role and map it
  const role = roleSet[0];
  
  switch (role) {
    case 'LEARNER':
      return 'learner';
    case 'INSTRUCTOR':
      return 'tutor';
    case 'ADMIN':
      return 'admin';
    case 'OBSERVER':
      return 'manager';
    case 'USER':
      return 'writer';
    default:
      return 'learner';
  }
}

/**
 * Maps generated User to local User type
 */
export function mapGeneratedUserToLocal(generatedUser: GeneratedUser): LocalUser {
  if (!generatedUser.id || !generatedUser.email || !generatedUser.name) {
    throw new Error('Invalid user data: missing required fields');
  }

  return {
    id: generatedUser.id,
    email: generatedUser.email,
    name: generatedUser.name || generatedUser.username || 'User',
    role: mapRole(generatedUser.roleSet),
    avatar: undefined, // Backend doesn't provide avatar yet
  };
}

