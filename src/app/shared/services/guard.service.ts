import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {of} from 'rxjs/internal/observable/of';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GuardServices implements CanActivate, CanActivateChild {

  constructor(private auth: AuthService,
              private router: Router,
              private user: UserService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (this.auth.isAuthenticated()) {
      if (this.user.getRole() === route.data.role) {
        return of(true);
      }
      this.router.navigate(['/login'], {
        queryParams: {
          incorrectRole: true
        }
      });
      return of(false);
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          accessDenied: true
        }
      });
      return of(false);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
