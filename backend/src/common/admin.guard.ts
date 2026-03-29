import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = ctx.switchToHttp().getRequest();
    
    // Safety check for development: if no user is present, deny access unless we're bypassing for now.
    // In production, JwtAuthGuard MUST run before this to populate the request.user.
    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have administrative privileges to perform this action.');
    }

    return true;
  }
}
