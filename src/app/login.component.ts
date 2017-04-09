import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UserService } from './user.service';

@Component( {
  selector: 'login-section',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.fb.group({
      'email': ["", [Validators.required, Validators.email]],
      'password': ["", [Validators.required, Validators.minLength(8)]],
    });
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

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

  invalidCredentials = false;
  loggingIn = false;
  networkError = false;

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

  doLogin(event) {
    this.loggingIn = true;
    this.userService.authenticate(this.loginForm.value.email, this.loginForm.value.password)
    .then(token => {
      this.loggingIn = false;
      localStorage.setItem("token", token);
    })
    .catch(reason => {
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