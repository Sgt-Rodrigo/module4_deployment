import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Role } from 'src/roles/roles.enum';

@Injectable() 
export class AuthGuard implements CanActivate {
  constructor(private reflector:Reflector,
              private readonly jwtService:JwtService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    //* log
    console.log('AuthGuard: Entering canActivate');

    //w skips methods where authorization is not mandatory
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    //*log
    console.log('AuthGuard: isPublic', isPublic);

    if (isPublic) {
      //* Skip authentication by returning early
      return true;
    }

    //w checks authorization, gets the header 
    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization']?.split(' ')[1] ?? '';
    //*log
    console.log('AuthGuard: Token present:', !!token);

    if(!token) {
      throw new UnauthorizedException('Bearer Token Not Found')
    }

    //w if you modify this
    try {
      const secret = process.env.JWT_SECRET;
      console.log('AuthGuard: JWT_SECRET present:', !!secret);

      //w verifies token and decodes payload
      //! otherwise it throws an error directly (no need to handle it)
      const payload = await this.jwtService.verifyAsync(token, {secret});
      console.log('AuthGuard: Token verified, payload:', payload);
      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);
      //? already defined in service
      // payload.roles = [Role.ADMIN]
      request.user = payload;
      return true
    } catch (error) {
      console.error('AuthGuard: Token verification failed', error);
      throw new UnauthorizedException('Invalid Token')
    }
  }
}
