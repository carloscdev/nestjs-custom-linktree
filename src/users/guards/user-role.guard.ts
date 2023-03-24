import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { META_ROLES } from 'src/users/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      ctx.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new BadRequestException('User not found');

    if (!validRoles.includes(user['role']))
      throw new ForbiddenException('You do not have permission');

    return true;
  }
}
