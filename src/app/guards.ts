import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

// Protecting routers that only registered users can access
@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private svc: UserService, private router: Router) {}
  canActivate(): boolean {
    let id = localStorage.getItem('id');
    let token = localStorage.getItem('token');
    if (token == null) {
      this.router.navigateByUrl('/');
      return false;
    }
    if (id == null) {
      this.svc.getProfile().subscribe(
        user => {
          localStorage.setItem('id', user.id);
          return true;
        },
        () => {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/');
          return false;
        }
      )
    }
    return true;
  }
}

// Protecting routers that only non logged in users can access
// @Injectable()
// export class NonLoggedInGuard implements CanActivate {
//   constructor(private svc: UserService, private router: Router) {}
//   canActivate(): boolean {
//     // let id = localStorage.getItem('id');
//     // let token = localStorage.getItem('token');
//     // if (token == null) {
//     //   this.router.navigateByUrl('/');
//     //   return true;
//     // }
//     // if (id == null) {
//     //   this.svc.getProfile().subscribe(
//     //     user => {
//     //       localStorage.setItem('id', user.id);
//     //       return false;
//     //     },
//     //     () => {
//     //       localStorage.removeItem('token');
//     //       this.router.navigateByUrl('/');
//     //       return true;
//     //     }
//     //   )
//     // }
//     return false;
//   }
// }

// Protecting routers that only guests can access
@Injectable()
export class GuestGuard implements CanActivate {
  constructor(private svc: UserService, private router: Router) {}
  canActivate(): boolean {
    let token = localStorage.getItem('token');
    let isGuest = localStorage.getItem('is_guest');
    if (token == null) {
      this.router.navigateByUrl('/');
      return false;
    }
    if (!!token && isGuest == 'true') return true;
    if (isGuest == 'false') return false;
    this.svc.isGuest().subscribe(
      (user) => {
        localStorage.setItem('is_guest', 'true');
        return true;
      },
      () => {
        localStorage.setItem('is_guest', 'false');
        this.router.navigateByUrl('/');
        return false;
      });
  }
}

// Protecting routers that only hosts can access
@Injectable()
export class HostGuard implements CanActivate {
  constructor(private svc: UserService, private router: Router) {}
  canActivate(): boolean{
    let token = localStorage.getItem('token');
    let isHost = localStorage.getItem('is_host');
    if (token == null) {
      this.router.navigateByUrl('/');
      return false;
    }
    if (!!token && isHost == 'true') return true;
    if (isHost == 'false') return false;
    this.svc.isHost().subscribe(
      (user) => {
        localStorage.setItem('is_host', 'true');
        return true;
      },
      () => {
        localStorage.setItem('is_host', 'false');
        this.router.navigateByUrl('/');
        return false;
      });
  }
}

// Protecting routers that only unverified users can access
@Injectable()
export class UnverifiedGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    let value = localStorage.getItem('is_host') == 'false' && localStorage.getItem('is_guest') == 'false';
    if (!value) this.router.navigateByUrl('/profile');
    return value;
  }
}
