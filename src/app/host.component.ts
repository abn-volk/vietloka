import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, User } from './user.service';
import { HouseService, House } from './house.service';

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

  constructor(private router: Router, private route: ActivatedRoute,
    private userService: UserService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      // Get the host information
      this.userService.getHost(this.id).subscribe(
        (host) => {
          this.host = host;
          console.log(host);
        },
        // (error) => console.log(error)
        (error) => window.location.replace('/home')
      );

      // Get the list of hosts' houses
      this.userService.getAllHostHouses(this.id).subscribe(
        (houses) => {
          console.log(houses);
          this.houses = houses;
        },
        (error) => console.log(error)
      );

    })
  }

}
