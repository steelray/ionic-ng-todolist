import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpErrorService } from '../services/http-error.service';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private httpErrorService: HttpErrorService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {

          // client-side error

          errorMessage = `Error: ${error.error.message}`;

        } else {

          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

        }

        this.httpErrorService.error$.next(errorMessage);

        return throwError(errorMessage);

      })
    );
  }

}

