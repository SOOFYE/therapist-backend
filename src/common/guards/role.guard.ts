import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
      private readonly jwtService: JwtService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const roles = this.reflector.get<string[]>('roles', context.getHandler());
      if (!roles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ForbiddenException('Invalid or missing token');
      }
  
      const token = authHeader.split(' ')[1];
  
      try {
        const decoded = this.jwtService.verify(token); 
        request.user = {
          id: decoded.sub,
          role: decoded.role,
        };
  
        if (!roles.includes(decoded.role)) {
          throw new ForbiddenException('You do not have the required role');
        }
  
        return true;
      } catch (error) {
        throw new ForbiddenException('Token validation failed');
      }
    }
  }