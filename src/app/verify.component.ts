import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './user.service';

@Component( {
  selector: 'verify-section',
  templateUrl: './verify.component.html',
})
export class VerifyComponent {
  networkError: boolean;
  verifying: boolean;
  verificationForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {}

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
          .finally(
            () => {
              if (v.role == 'host' || v.role=='both') {
                this.userService.addHost({user: localStorage.getItem('id')}).subscribe(
                  () => {console.log("SUCCESS!!!");},
                  () => {this.networkError = true}
                );
              }
            }
          )
          .subscribe(
            () => {console.log("SUCCESS!!!");},
            () => {this.networkError = true}
          );
        }
      },
      () => {this.networkError = true},
      () => {this.verifying = false}
    );
    console.log(this.verificationForm.value);
    console.log(this.verificationForm.valid);
  }
}
