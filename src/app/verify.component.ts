import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


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

  constructor(private fb: FormBuilder, private userService: UserService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.networkError = false;
    this.verifying = false;
    this.buildForm();
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

  onValueChanged(data?: any) {
    if (!this.verificationForm) return;
    const form = this.verificationForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = this.msg;
      }
    }
  }

  formErrors = {
    'job': '',
    'placeOfWork': '',
    'idNumber': '',
    'dateOfBirth': ''
  };
  msg = 'This field is obligatory.';

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
                setTimeout(() => this.gotoHome(), 3000);
              }
            },
            () => {this.networkError = true}
          );
        }

        if (v.role == 'host' || v.role=='both') {
          this.userService.addHost({user: localStorage.getItem('id')}).subscribe(
            () => {
              localStorage.setItem('is_host', 'true');
              this.modalRef = this.modalService.open(this.content);
              setTimeout(() => this.gotoHome(), 3000);
            },
            () => {this.networkError = true}
          );
        }
      },
      () => {this.networkError = true},
      () => {this.verifying = false}
    );

  }

  gotoHome() {
    this.modalRef.close();
    window.location.replace('/');
  }

}
