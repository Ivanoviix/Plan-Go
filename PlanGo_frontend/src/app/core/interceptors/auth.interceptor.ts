import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // Inyecta el Router para redirigir al usuario

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Redirige al usuario a la página de inicio de sesión
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};