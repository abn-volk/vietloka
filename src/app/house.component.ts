import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  @ViewChild('rateModal') rateModal;
  modalRef: NgbModalRef;
  rateModalRef: NgbModalRef;
  rateForm: FormGroup;
  isRating: Boolean = false;
  isLeaving: Boolean = false;
  commentNetworkError: Boolean = false;
  rentNetworkError: Boolean = false;

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
  currentRent: string;
  hasRequest: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private houseService: HouseService,
    private userService: UserService, private sanitizer: DomSanitizer, private fb: FormBuilder,
    private rentService: RentService, private modalService: NgbModal) {
    this.buildForm();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.houseService.getHouse(this.id).subscribe(
        (house) => {
          this.house = house;
          console.log(house);
          // Get rent history
          this.rentService.getRentHistory(this.id).subscribe(
            (rents) => {
              rents.forEach((rent) => {
                if (rent.accepted && !rent.completed) {this.currentRent = rent.id};
                if (!rent.accepted) this.hasRequest = true;
              })
            }
          );
          // Get ratings
          this.houseService.getHouseRatings(this.id).subscribe(
            (ratings) => {
              this.ratings = ratings;
            },
            (error) => {
              console.log(error);
            }
          );
          // Get reviews
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
        (error) => window.location.replace('/home')
      );
    });

    this.buildForm();
  }

  buildForm() {
    this.rateForm = this.fb.group({
      'title': ['', [Validators.required]],
      'content': ['', [Validators.required]],
    });
    this.rateForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.rateForm) return;
    const form = this.rateForm;
    this.commentNetworkError = false;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = false;
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = true;
      }
    }
  }

  formErrors = {
    'title': true,
    'content': true
  };

  showRateDialog() {
    this.rateModalRef = this.modalService.open(this.rateModal);
  }

  closeRateDialog() {
    this.rateModalRef.close();
    window.location.reload();
  }

  doRate(isApprove: boolean) {
    const value = this.rateForm.value;
    let req = {
      title: value.title,
      content: value.content,
      rent: this.currentRent,
      guest: localStorage.getItem('id'),
      approves: isApprove
    }
    this.isRating = true;
    this.rentService.postComment(req).subscribe(
      res => {
        this.isRating = false;
        this.rateModalRef.close();
      },
      err => {
        this.isRating = true;
        this.commentNetworkError = true;
      }
    );
  }

  finishStay() {
    this.isLeaving = true;
    this.rentService.leave(this.currentRent).subscribe(
      res => {
        this.isLeaving = false;
        this.rateModalRef = this.modalService.open(this.rateModal);
      },
      err => {
        this.isLeaving = false;
        this.rentNetworkError = true;
      }
    )
  }

  trustResource(i: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(i)
  }

  // Check if the users visting the house page is the owner or not
  checkOwner(): boolean{
    return (localStorage.getItem('id') === this.house.owner.id)
  }

  // If users press on Stay at this place button
  doStay() {
    this.rentService.postRent(this.house.id).subscribe(
      (res) => {
        this.modalRef = this.modalService.open(this.rentModal);
        window.location.reload();
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
