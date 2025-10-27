import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  helper = new JwtHelperService();

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token && !this.helper.isTokenExpired(token)) {
      // token varsa ve süresi geçmemişse
      return true;
    } else {
      // token yoksa veya süresi dolmuşsa
      localStorage.removeItem('token');
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
