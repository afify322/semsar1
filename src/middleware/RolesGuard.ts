import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const hasRole = () => {
        roles.find((item) => item === user.role);
      };
      console.log(roles)
      if (user.role == roles[0] || roles[1]) {
        return user;
      }
  
      throw new HttpException('Forbbiden', HttpStatus.FORBIDDEN);
    }
  }
  