import { Component, Input, OnInit} from '@angular/core';
import { User, UserService } from './user.service';

@Component( {
  selector: 'profile-section',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  name: string;
  email: string;
  createdAt: Date;
  picture: string;

  constructor (private userService: UserService) {
    if (localStorage.getItem('token') != null) {
      this.userService.getProfile()
        .subscribe(
          user => {
            this.name = user.name; 
            this.picture = user.picture; 
            this.createdAt = user.createdAt; 
            this.email = user.email
          },
          reason => {
            window.location.replace('/')
          });
    }
    else window.location.replace('/');
  }

  doLogout() {
    localStorage.removeItem('token');
    window.location.replace('/');
  }
}