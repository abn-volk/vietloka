import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HouseService } from './house.service';
import { UserService } from './user.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component( {
  selector: 'house-section',
  templateUrl: './house.component.html',
})
export class HouseComponent implements OnInit, OnDestroy{

  constructor(private router: Router, private route: ActivatedRoute, private houseService: HouseService, private userService: UserService) {}
  id: string;
  sub: any;
  house: any = {
    image: ['http://i.imgur.com/y9VtVep.jpg', 'http://i.imgur.com/fSbhzNL.jpg'],
    title: 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
    description: 'En la mondon venis nova sento, tra la mondo iras forta voko,  per flugiloj de facila vento,  nun de loko flugu ĝi al loko.',
    area: 30,
    address: 'Nieuwe Binnenweg 176, Rotterdam, the Netherlands',
    numOfTotalSlots: 9,
    hasChildren: true,
    hasOlders: false,
    hasElectricHeater: true,
    hasTV: true,
    hasCarPark: true,
    hasInternet: true,
    hasWashingMachine: false,
    WC: 'None'
  };

  host: any = {
    id:"590b590b2043f315704f3b53",
    name:"Vietloka",
    picture:"https://gravatar.com/avatar/d2fa7965bdc0f8eb4e6a66426acf0574?d=identicon",
    role:"user",
    email:"b@e.com",
    job: "Teacher",
    placeOfWork: "UET-VNU"
  }

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