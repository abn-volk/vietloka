import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UserService } from './user.service';

@Component( {
  selector: 'login-section',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm: FormGroup;
  invalidCredentials: boolean;
  loggingIn: boolean;
  networkError: boolean;

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.buildForm();
    this.invalidCredentials = false;
    this.loggingIn = false;
    this.networkError = false;
    // If users already logged in but try to access the page,
    // the browser will automatically go to the home page
    if (localStorage.getItem('token') != null) {
      this.userService.getProfile().subscribe(user => window.location.replace('/home'));
    }
  }

  buildForm(): void {
    this.loginForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(8)]],
    });
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  // Set validation message when users start to type in
  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
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


  // Form errors, errors when users type in wrong format of information
  formErrors = {
    'email': '',
    'password': '',
  };

  validationMessages = {
    'email': {
      'required': 'This field is obligatory.',
      'email': 'Please enter a valid email address.'
    },
    'password': {
      'required': 'This field is obligatory.',
      'minlength': 'Your password must be at least 8 characters long.'
    },
  };

  // After users press login button
  doLogin(event) {
    this.loggingIn = true;
    this.userService.authenticate(this.loginForm.value.email, this.loginForm.value.password)
    .subscribe(
    token => {
      this.loggingIn = false;
      localStorage.setItem('token', token);
      window.location.replace('/home');
    },
    reason => {
      this.loggingIn = false;
      if (reason.status == 401) {
        this.invalidCredentials = true;
      }
      else {
        this.networkError = true;
      }
    });
  }
}
