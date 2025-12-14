/**
 * User Mapper Utility
 * Maps generated API UserDto type to local User type
 */

import { User as LocalUser, UserRole } from '@/types';
import { UserDto, UserDtoRolesItem } from '@/generated/api/openAPIDefinition.schemas';

/**
 * Maps backend UserDtoRolesItem to frontend UserRole
 * Yeni yapıda TUTOR, MANAGER, WRITER direkt var
 */
function mapRole(roles?: UserDtoRolesItem[]): UserRole {
  if (!roles || roles.length === 0) {
    return 'learner'; // Default role
  }

  // Get the first role and map it
  const role = roles[0];
  
  switch (role) {
    case 'LEARNER':
      return 'learner';
    case 'TUTOR':
      return 'tutor';
    case 'INSTRUCTOR': // Fallback for backward compatibility
      return 'tutor';
    case 'ADMIN':
      return 'admin';
    case 'MANAGER':
      return 'manager';
    case 'OBSERVER': // Fallback for backward compatibility
      return 'manager';
    case 'WRITER':
      return 'writer';
    case 'USER': // Fallback for backward compatibility
      return 'writer';
    default:
      return 'learner';
  }
}

/**
 * Maps generated UserDto to local User type
 */
export function mapUserDtoToLocal(userDto: UserDto): LocalUser {
  if (!userDto.id) {
    throw new Error('Invalid user data: missing id');
  }

  // Email veya username olabilir
  const email = userDto.email || userDto.username || '';
  if (!email) {
    throw new Error('Invalid user data: missing email or username');
  }

  // Name: name + lastName veya sadece name veya username
  const fullName = userDto.name 
    ? (userDto.lastName ? `${userDto.name} ${userDto.lastName}` : userDto.name)
    : userDto.username || 'User';

  return {
    id: userDto.id,
    email: email,
    name: fullName,
    role: mapRole(userDto.roles),
    avatar: undefined, // Backend doesn't provide avatar yet
  };
}

/**
 * @deprecated Use mapUserDtoToLocal instead
 * Kept for backward compatibility
 */
export function mapGeneratedUserToLocal(userDto: UserDto): LocalUser {
  return mapUserDtoToLocal(userDto);
}

