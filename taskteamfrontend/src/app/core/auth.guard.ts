import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  helper = new JwtHelperService();

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (!token || this.helper.isTokenExpired(token)) {
      localStorage.removeItem('token');
      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRole = route.data['requiredRole'];
    
    if (requiredRole) {
      const userRole = this.getUserRoleFromToken(token);
      
      if (userRole !== requiredRole && userRole !== 'Admin') {
        Swal.fire({
          icon: 'error',
          title: 'Yetkiniz Yok',
          text: 'Bu sayfaya erişim yetkiniz bulunmamaktadır.',
          confirmButtonColor: '#d33'
        });
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    return true;
  }

  private getUserRoleFromToken(token: string): string | null {
    try {
      const decodedToken = this.helper.decodeToken(token);
      
      return (
        decodedToken.role ||
        decodedToken.Role ||
        decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        null
      );
    } catch (error) {
      console.error('Token decode hatası:', error);
      return null;
    }
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const role = this.getUserRoleFromToken(token);
    return role === 'Admin' || role === 'admin';
  }
}
