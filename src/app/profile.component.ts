import { Component, Input, OnInit } from '@angular/core';
import { User, UserService } from './user.service';
import { House, HouseService } from './house.service';
import { NgbTab, NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component( {
  selector: 'profile-section',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user: User;
  houses: Array<House>;
  verified = false;
  isHost = false;
  isGuest = false;

  constructor (private userService: UserService, private houseService: HouseService) {}

  ngOnInit() {
    this.userService.getProfile()
      .subscribe(
        // Check if user is a host or a guest or both
        user => {
          this.user = user;
          this.verified = (localStorage.getItem('is_guest') === 'true'
                            || localStorage.getItem('is_host') === 'true');
          this.isHost = localStorage.getItem('is_host') === 'true';
          this.isGuest = localStorage.getItem('is_guest') === 'true';
          console.log(user)
        },
        reason => {
          window.location.replace('/')
        });
    this.houseService.getMyHouses().
      subscribe(
        (houses) => {
          console.log(houses);
          this.houses = houses;
        },
        (error) => console.log(error)
        // (error) => window.location.replace('/home')
      );
  }

  showMyHouse() {

  }

  // After users press log out button
  doLogout() {
    localStorage.clear();
    window.location.replace('/');
  }

}
