import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HouseService, House } from './house.service';
import { UserService, User } from './user.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component( {
  selector: 'house-section',
  templateUrl: './house.component.html',
})
export class HouseComponent implements OnInit, OnDestroy{

  constructor(private router: Router, private route: ActivatedRoute, private houseService: HouseService, private userService: UserService) {}
  id: string;
  sub: any;
  house: House;
  isLoggedIn = (localStorage.getItem('token') && localStorage.getItem('id'));
  isGuest = (localStorage.getItem('is_guest') === 'true');
  isHost = (localStorage.getItem('is_host') === 'true');

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.houseService.getHouse(this.id).subscribe(
        (house) => {
          this.house = house;
          console.log(house);
        },
        (error) => console.log(error)
      );
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
