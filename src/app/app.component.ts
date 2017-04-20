import { Component, OnInit } from '@angular/core';
import { User, UserService } from './user.service';

import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userService: UserService){}

  isNavbarCollapsed: boolean;
  checked: boolean;
  signedIn: boolean;
  name: string;
  picture: string;

  ngOnInit() : void {
    this.isNavbarCollapsed = true;
    this.checked = false;
    this.signedIn = false;
    if (localStorage.getItem('token') != null) {
      this.userService.getProfile()
      .subscribe(
        user => {
          localStorage.setItem('id', user.id);
          this.name = user.name; 
          this.picture = user.picture; 
          this.signedIn = true; 
          this.checked = true
          if (localStorage.getItem('is_guest') == null)
            this.userService.isGuest()
            .finally(
              () => {
                if (localStorage.getItem('is_host') == null)
                  this.userService.isHost()
                  .subscribe(
                    user => {localStorage.setItem('is_host', 'true')},
                    reason => {localStorage.setItem('is_host', 'false')}
                  )
              }
            )
            .subscribe(
              user => {localStorage.setItem('is_guest', 'true'); console.log("WTF")},
              reason => {localStorage.setItem('is_guest', 'false')}
            )
        },
        reason => {this.signedIn = false; this.checked = true})
    }
    else {
      this.checked = true;
    }
  }

}
