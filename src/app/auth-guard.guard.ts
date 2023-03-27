import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { StorageService } from './service/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {

  constructor(private authService: StorageService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const expectedRoles = route.data['expectedRoles'];
    const role = this.authService.getRole();

    if (isLoggedIn && expectedRoles.includes(role)) {
      return true;
    }

    if (isLoggedIn) {
      this.router.navigate(['/home']);
      return true;
    }


    this.router.navigate(['/welcome']);
    return false;
  }
}
