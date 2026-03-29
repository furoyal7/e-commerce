import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IdentityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If a user exists (from JwtAuthGuard), we can keep it for further processing in the request object, 
    // but we must not modify the body as it triggers 'forbidNonWhitelisted' validation errors.
    
    return next.handle();
  }
}
