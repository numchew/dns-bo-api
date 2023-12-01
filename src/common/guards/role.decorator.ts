import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

export const hasRoles = (...hasRole: UserRole[]) =>
  SetMetadata('role', hasRole);
