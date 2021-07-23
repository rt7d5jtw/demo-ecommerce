import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/user.entity';

export const RolesAllowed = (...roles: string[]) => SetMetadata('roles', roles);
