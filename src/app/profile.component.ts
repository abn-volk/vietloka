import { Component, Input, OnInit } from '@angular/core';
import { User, UserService } from './user.service';

@Component( {
  selector: 'profile-section',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user: User;
  verified = false;

  constructor (private userService: UserService) {}

  ngOnInit() {
    this.userService.getProfile()
      .subscribe(
        user => {
          this.user = user;
          this.verified = (localStorage.getItem('is_guest') === 'true' || localStorage.getItem('is_host') === 'true');
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