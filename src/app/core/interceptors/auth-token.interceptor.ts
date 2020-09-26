import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HTTP_CODES } from '../enums/http-status-codes.enum';
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.authToken;

    const headers: any = {};

    if (token) {
      // tslint:disable-next-line:no-string-literal
      headers['Authorization'] = `Bearer ${token}`;
    }

    request = request.clone({
      setHeaders: headers
    });

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === HTTP_CODES.REDIRECT) {
            // redirect
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse && err.status === HTTP_CODES.NOT_AUTHED) {
            // not authorized
            this.authService.removeToken();
            this.router.navigate(['/auth/sign-in']);
          } else if (err instanceof HttpErrorResponse && err.status === HTTP_CODES.NOT_ALLOWED) {
            this.router.navigate(['/auth/sign-in']);
          }
        }
      )
    );
  }
}
