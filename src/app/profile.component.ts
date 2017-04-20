import { Component, Input, OnInit } from '@angular/core';
import { User, UserService } from './user.service';

@Component( {
  selector: 'profile-section',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user: User;

  constructor (private userService: UserService) {
    this.userService.getProfile()
      .subscribe(
        user => {
          this.user = user;
        },
        reason => {
          window.location.replace('/')
        });
    }

  doLogout() {
    localStorage.clear();
    window.location.replace('/');
  }
}