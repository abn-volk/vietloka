import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HouseService, House, Comment } from './house.service';
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
  comments: Array<Comment> = [{
    title: 'You can dance, you can jive.',
    content: 'Having the time of your life. Ooh, see that girl, watch that scene, digging the dancing queen. Friday night and the lights are low',
    guest: 'jlajg',
    approves: false,
    rent: 'djgl'
  }];
  users: Array<any> = [{id:"590b590b2043f315704f3b53",name:"Vietloka",picture:"https://gravatar.com/avatar/d2fa7965bdc0f8eb4e6a66426acf0574?d=identicon",role:"user",email:"b@e.com",createdAt: new Date("2017-05-04T16:38:35.248Z")}];
  ratings = {approval: 10, disapproval: 13}
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
          this.houseService.getHouseRatings(this.id).subscribe(
            (ratings) => {
              this.ratings = ratings;
            },
            (error) => {
              console.log(error);
            }
          );
          this.houseService.getHouseComments(this.id).subscribe(
            (comments) => {
              console.log(comments);
              this.comments = comments;
              comments.forEach((comment, index) => {
                this.userService.getUser(comment.guest).subscribe(
                  (user) => {
                    this.users.push(user);
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              });
            },
            (error) => {
              console.log(error);
            }
           );
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
        console.log(error);
      }
    )
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
