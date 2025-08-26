import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const token = auth.token;

    if (!token || req.url.endsWith('/api/auth/login')) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
    });

    return next(authReq);
};