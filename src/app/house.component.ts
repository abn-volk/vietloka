import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HouseService, House } from './house.service';
import { UserService, User } from './user.service';
import { NgbCarousel, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from "@angular/platform-browser";
import { RentService } from './rent.service';

@Component( {
  selector: 'house-section',
  templateUrl: './house.component.html',
})
export class HouseComponent implements OnInit, OnDestroy{
  @ViewChild('rentModal') rentModal;
  modalRef: NgbModalRef;
  id: string;
  sub: any;
  house: House;
  isLoggedIn = (localStorage.getItem('token') && localStorage.getItem('id'));
  isGuest = (localStorage.getItem('is_guest') === 'true');
  isHost = (localStorage.getItem('is_host') === 'true');

  constructor(private router: Router, private route: ActivatedRoute, private houseService: HouseService, 
    private userService: UserService, private sanitizer: DomSanitizer,
    private rentService: RentService, private modalService: NgbModal) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.houseService.getHouse(this.id).subscribe(
        (house) => {
          this.house = house;
          console.log(house);
        },
        // (error) => console.log(error)
        (error) => window.location.replace('/home')
      );
    })
  }

  trustResource(i: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(i)
  }

  doStay() {
    this.rentService.postRent(this.house.id).subscribe(
      (res) => {
        this.modalRef = this.modalService.open(this.rentModal);
      },
      (error) => {
        
      }
    )
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
