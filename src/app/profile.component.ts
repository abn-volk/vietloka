import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { User, UserService } from './user.service';
import { House, HouseService } from './house.service';
import { Rent, RentService} from './rent.service';
import { NgbTab, NgbTabset, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component( {
  selector: 'profile-section',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  @ViewChild('rentdialog') rentDialog;
  user: User;
  houses: Array<House>;
  rents: Array<Rent>;
  renteds: Array<Rent>;
  selectedRent: Rent;
  modalRef: NgbModalRef;
  verified = false;
  isHost = false;
  isGuest = false;

  constructor (private userService: UserService, private houseService: HouseService,
     private rentService: RentService, private modalService: NgbModal) {}

  ngOnInit() {
    // Get user profile
    this.userService.getProfile()
      .subscribe(
        // Check if user is a host or a guest or both
        user => {
          this.user = user;
          this.verified = (localStorage.getItem('is_guest') === 'true'
                            || localStorage.getItem('is_host') === 'true');
          this.isHost = localStorage.getItem('is_host') === 'true';
          this.isGuest = localStorage.getItem('is_guest') === 'true';
          // console.log(user)
        },
        reason => {
          window.location.replace('/')
        });
    // Get all the houses of users, if they are hosts
    this.houseService.getMyHouses().
      subscribe(
        (houses) => {
          // console.log(houses);
          this.houses = houses;
        },
        (error) => console.log(error)
        // (error) => window.location.replace('/home')
      );
    // Get all the guests stayed at users' houses, if they are hosts
    this.rentService.getMyGuests()
      .subscribe(
        (rents) => {
          // console.log(rents);
          this.rents = rents;
        },
        (error) => console.log(error)
      );
    // Get all the houses that users used to stay in, if they are guests
    this.rentService.getMyRents()
      .subscribe(
        (renteds) => {
          // console.log(renteds);
          this.renteds = renteds;
        },
        (error) => console.log(error)
      );
  }

  // After hosts click on a guest in my guests tab
  checkRent(rent: Rent) {
    this.modalRef = this.modalService.open(this.rentDialog);
    this.selectedRent = rent;
    console.log(this.selectedRent);
  }

  // After users press log out button
  doLogout() {
    localStorage.clear();
    window.location.replace('/');
  }



}
