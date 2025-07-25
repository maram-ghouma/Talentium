
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
canActivate(context: ExecutionContext): boolean {
  const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
    context.getHandler(),
    context.getClass(),
  ]);
  console.log('🔒 Required roles:', requiredRoles);

  if (!requiredRoles) {
    console.log('🔒 No roles required, allowing access');
    return true;
  }

  const ctx = GqlExecutionContext.create(context);
  const user = ctx.getContext().req.user;

  console.log('🔒 User object:', JSON.stringify(user, null, 2));
  console.log('🔒 User role:', user?.role);

  if (!user || !user.role) {
    console.log('🔒 No user or role found, denying access');
    return false;
  }

  return requiredRoles.includes(user.role);
}
}