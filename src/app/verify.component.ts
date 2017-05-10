import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";


@Component( {
  selector: 'verify-section',
  templateUrl: './verify.component.html',
})
export class VerifyComponent {
  @ViewChild('content') content;
  networkError: boolean;
  verifying: boolean;
  verificationForm: FormGroup;
  modalRef: NgbModalRef;

  constructor(private fb: FormBuilder, private userService: UserService, private modalService: NgbModal, private router: Router) {}

  ngOnInit(): void {
    this.networkError = false;
    this.verifying = false;
    this.buildForm();
    //
    // // If users already verified but try to access the page,
    // // the browser will automatically go to the profile page
    // if (localStorage.getItem('is_guest') === 'true'
    //   || localStorage.getItem('is_host') === 'true') {
    //   window.location.replace('/profile');
    // }
  }

  buildForm(): void {
    this.verificationForm = this.fb.group({
      'job': ['', [Validators.required]],
      'placeOfWork': ['', [Validators.required]],
      'idNumber': ['', [Validators.required]],
      'gender': ['other'],
      'dateOfBirth': ['', [Validators.required]],
      'role': ['both'],
      'nationality': ['']
    });
    this.verificationForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

  }

  // Set validation message when users start to type in
  onValueChanged(data?: any) {
    if (!this.verificationForm) return;
    const form = this.verificationForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';

      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = this.msg;
      }
    }
  }

  // Form errors, errors when users left a required field blank
  formErrors = {
    'job': '',
    'placeOfWork': '',
    'idNumber': '',
    'dateOfBirth': ''
  };
  msg = 'This field is obligatory.';

  // After users press the verify button
  doVerify(event) {
    this.verifying = true;
    let v = this.verificationForm.value;
    let updatedInfo = {
      job: v.job,
      placeOfWork: v.placeOfWork,
      identityNumber: v.idNumber,
      gender: v.gender,
      dateOfBirth: v.dateOfBirth
    }
    this.userService.updateUser(updatedInfo).subscribe(
      () => {
        // Set nationality
        let nationality;
        if (v.role == 'guest') nationality = v.nationality;
        else nationality = "Vietnam";
        if (v.role == 'guest' || v.role=='both') {
          let req = {user: localStorage.getItem('id'), nationality: nationality};
          this.userService.addGuest(req)
          .subscribe(
            () => {
              localStorage.setItem('is_guest', 'true');
              if (v.role == 'guest') {
                this.modalRef = this.modalService.open(this.content);
                setTimeout(() => this.gotoProfile(), 3000);
              }
            },
            () => {this.networkError = true}
          );
        }

        // Add hosts
        if (v.role == 'host' || v.role=='both') {
          this.userService.addHost({user: localStorage.getItem('id')}).subscribe(
            () => {
              localStorage.setItem('is_host', 'true');
              this.modalRef = this.modalService.open(this.content);
              setTimeout(() => this.gotoProfile(), 3000);
            },
            () => {this.networkError = true}
          );
        }
      },
      () => {this.networkError = true},
      () => {this.verifying = false}
    );

  }

  // Go to the profile page after verification
  gotoProfile() {
    this.modalRef.close();
    this.router.navigateByUrl('/profile');
  }

}
