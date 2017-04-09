import { Component, OnInit } from '@angular/core';
import { User, UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userService: UserService){}
  isNavbarCollapsed = true;

  checked = false;
  signedIn = false;
  name = '';
  picture = '';
  ngOnInit() : void {
    if (localStorage.getItem('token') != null) {
      this.userService.getProfile()
          .then(user => {this.name = user.name; this.picture = user.picture; this.signedIn = true; this.checked = true})
          .catch(reason => {this.signedIn = false; this.checked = true});
    }
  }

}
