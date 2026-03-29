import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Role Hierarchy check
    const roleHierarchy: Record<string, number> = {
      [UserRole.USER]: 0,
      [UserRole.EDITOR]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPER_ADMIN]: 3,
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = Math.min(...roles.map(r => roleHierarchy[r] || 0));

    // Specifically block DELETE for EDITOR
    if (user.role === UserRole.EDITOR && request.method === 'DELETE') {
      throw new ForbiddenException('Editors are not permitted to delete resources');
    }

    return userLevel >= requiredLevel;
  }
}

export const Roles = (...roles: UserRole[]) => {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (propertyKey) {
      Reflect.defineMetadata('roles', roles, target, propertyKey);
    } else {
      Reflect.defineMetadata('roles', roles, target);
    }
  };
};
