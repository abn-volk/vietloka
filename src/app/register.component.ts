import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterRequest, User, UserService } from './user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component( {
  selector: 'register-section',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  @ViewChild('content') content; 
  registerForm: FormGroup;
  duplicateEmail: boolean;
  registering: boolean;
  networkError: boolean;
  modalRef: NgbModalRef;

  constructor(private fb: FormBuilder, private userService: UserService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.buildForm();
    this.duplicateEmail = false;
    this.registering = false;
    this.networkError = false;
  }

  buildForm(): void {
    this.registerForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(8)]],
      'name': ['', [Validators.required,]],
    });
    this.registerForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.registerForm) { return; }
    const form = this.registerForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'name': '',
    'email': '',
    'password': '',
  };
  
  validationMessages = {
    'name': {
      'required': 'This field is obligatory.',
    },
    'email': {
      'required': 'This field is obligatory.',
      'email': 'Please enter a valid email address.'
    },
    'password': {
      'required': 'This field is obligatory.',
      'minlength': 'Your password must be at least 8 characters long.'
    },
  };

  doRegister(event) {
    this.registering = true;
    this.userService.addUser(new RegisterRequest(this.registerForm.value))
    .subscribe(
      user => {
        this.registering = false;
        this.modalRef = this.modalService.open(this.content);
        setTimeout(() => this.gotoLogin(), 3000);
      },
      reason => {
        this.registering = false;
        if (reason.status == 409) {
          this.duplicateEmail = true;
        }
        else {
          this.networkError = true;
        }
      });
  }

  gotoLogin() {
    this.modalRef.close();
    window.location.replace('/login');
  }
}