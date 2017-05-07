import { Component, Input, OnInit } from '@angular/core';
import { User, UserService } from './user.service';
import { NgbTab, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component( {
  selector: 'profile-section',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user: User;
  verified = false;
  isHost = false;

  constructor (private userService: UserService) {}

  ngOnInit() {
    this.userService.getProfile()
      .subscribe(
        user => {
          this.user = user;
          this.verified = (localStorage.getItem('is_guest') === 'true' || localStorage.getItem('is_host') === 'true');
          this.isHost = localStorage.getItem('is_host') === 'true';
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