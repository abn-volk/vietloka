import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, User } from './user.service';
import { HouseService, House } from './house.service';
import { Observable } from 'rxjs/Rx';


@Component( {
  selector: 'host-section',
  templateUrl: './host.component.html',
})
export class HostComponent implements OnInit{
  id: string;
  sub: any;
  host: User;
  houses: Array<House>;
  isLoggedIn = (localStorage.getItem('token') && localStorage.getItem('id'));
  isGuest = (localStorage.getItem('is_guest') === 'true');
  notFound: boolean = false;
  loading: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute,
    private userService: UserService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      // Get the host's information and houses
      Observable.forkJoin([
        this.userService.getHost(this.id),
        this.userService.getAllHostHouses(this.id)
      ]).subscribe(
        (data) => {
          this.host = data[0];
          this.houses = data[1];
          this.loading = false;
        },
        (error) => {
          this.notFound = true;
        }
      )
      

    })
  }

}
