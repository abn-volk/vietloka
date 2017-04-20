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
    console.log(this.verificationForm.value);
    console.log(this.verificationForm.valid);
  }
}