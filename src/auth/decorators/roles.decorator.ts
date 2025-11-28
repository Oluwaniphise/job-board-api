import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity'; // Import the defined UserRole type

// Define the unique key used to store role metadata on the route handler
export const ROLES_KEY = 'roles';

/**
 * Custom decorator to specify which roles are allowed to access a route.
 * * Usage in Controller:
 * @Roles('Employer')
 * @Post()
 * * @param roles An array of allowed UserRole strings (e.g., ['Employer', 'Admin']).
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
