import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable() 
export class TokenGuard implements CanActivate {
  constructor(private svc: UserService) {}
  canActivate() {
    let id = localStorage.getItem('id');
    let token = localStorage.getItem('token');
    if (token == null) {
      window.location.replace('/');
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
          return false;
        }
      )
    }
    return true;
  }
}

@Injectable() 
export class GuestGuard implements CanActivate {
  constructor (private svc: UserService) {}
  canActivate() {
    let token = localStorage.getItem('token');
    let isGuest = localStorage.getItem('is_guest');
    if (token == null) {
      window.location.replace('/');
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
        return false;
      });
  }
}

@Injectable() 
export class HostGuard implements CanActivate {
  constructor (private svc: UserService) {}
  canActivate() {
    let token = localStorage.getItem('token');
    let isHost = localStorage.getItem('is_host');
    if (token == null) {
      window.location.replace('/');
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
        return false;
      });
  }
}

@Injectable()
export class UnverifiedGuard implements CanActivate {
  canActivate() {
    return (localStorage.getItem('is_host') == 'false' && localStorage.getItem('is_guest') == 'false');
  }
}