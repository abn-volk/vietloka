import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, User } from './user.service';
import { NgbCarousel, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from "@angular/platform-browser";
import { RentService } from './rent.service';

@Component( {
  selector: 'host-section',
  templateUrl: './host.component.html',
})
export class HostComponent implements OnInit, OnDestroy{
  @ViewChild('rentModal') rentModal;
  modalRef: NgbModalRef;
  id: string;
  sub: any;
  host: User;
  isLoggedIn = (localStorage.getItem('token') && localStorage.getItem('id'));
  isGuest = (localStorage.getItem('is_guest') === 'true');

  constructor(private router: Router, private route: ActivatedRoute,
    private userService: UserService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.userService.getHost(this.id).subscribe(
        (host) => {
          this.host = host;
          console.log(host);
        },
        // (error) => console.log(error)
        (error) => window.location.replace('/home')
      );
    })
  }

  trustResource(i: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(i)
  }

  // After users press mail button
  mail(){

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
