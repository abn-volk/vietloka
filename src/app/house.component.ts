import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HouseService, House, Comment } from './house.service';
import { UserService, User } from './user.service';
import { NgbCarousel, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from "@angular/platform-browser";
import { RentService } from './rent.service';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

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
  comments: Array<Comment> = [];
  users: Array<any> = [];
  ratings: any;
  isLoggedIn = (localStorage.getItem('token') && localStorage.getItem('id'));
  isGuest = (localStorage.getItem('is_guest') === 'true');
  isHost = (localStorage.getItem('is_host') === 'true');
  currentRent: string;
  hasRequest: boolean = false;
  notFound: boolean = false;
  loading: boolean = true;

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
          Observable.forkJoin([
            this.rentService.getRentHistory(this.id),
            this.houseService.getHouseRatings(this.id),
            this.houseService.getHouseComments(this.id)
          ]).subscribe(
            (res) => {
              this.loading = false;
              let rents = res[0];
              rents.forEach((rent) => {
                 if (rent.accepted && !rent.completed) {this.currentRent = rent.id};
                 if (!rent.accepted) this.hasRequest = true;
               });
               this.ratings = res[1];
               this.comments = res[2];
            },
            (err) => {
              this.loading = true;
            }
          );
        },
        (error) => {
          this.loading = false;
          this.notFound = true;
        }
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
