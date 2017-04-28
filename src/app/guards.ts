import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable() 
export class TokenGuard implements CanActivate {
  constructor(private svc: UserService, private router: Router) {}
  canActivate() {
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

@Injectable() 
export class GuestGuard implements CanActivate {
  constructor(private svc: UserService, private router: Router) {}
  canActivate() {
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

@Injectable() 
export class HostGuard implements CanActivate {
  constructor(private svc: UserService, private router: Router) {}
  canActivate() {
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

@Injectable()
export class UnverifiedGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate() {
    let value = localStorage.getItem('is_host') == 'false' && localStorage.getItem('is_guest') == 'false';
    if (!value) this.router.navigateByUrl('/');
    return value;
  }
}