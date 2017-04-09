import {Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRequest, User, UserService } from './user.service';

@Component( {
  selector: 'register-section',
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  registerForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.registerForm = this.fb.group({
      'email': ["", [Validators.required, Validators.email]],
      'password': ["", [Validators.required, Validators.minLength(8)]],
      'name': ["", [Validators.required,]],
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

  duplicateEmail = false;
  registering = false;
  networkError = false;

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
    this.userService.addUser(new UserRequest(this.registerForm.value))
    .then(user => {
      this.registering = false;
      console.log(user);
    })
    .catch(reason => {
      this.registering = false;
      if (reason.status == 409) {
        this.duplicateEmail = true;
      }
      else {
        this.networkError = true;
      }
    });
  }
}