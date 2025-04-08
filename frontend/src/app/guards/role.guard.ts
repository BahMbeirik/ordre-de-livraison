import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getCurrentUser();
    const requiredRoles = route.data['role'];

    if (user && this.checkUserRole(user.role, requiredRoles)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }

  private checkUserRole(userRole: string, requiredRoles: string | string[]): boolean {
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole);
    } else {
      return userRole === requiredRoles;
    }
  }
}