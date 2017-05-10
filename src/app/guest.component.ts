import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, User } from './user.service';
import { NgbCarousel, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from "@angular/platform-browser";
import { RentService } from './rent.service';

@Component( {
  selector: 'guest-section',
  templateUrl: './guest.component.html',
})
export class GuestComponent implements OnInit, OnDestroy{
  @ViewChild('rentModal') rentModal;
  modalRef: NgbModalRef;
  id: string;
  sub: any;
  guest: User;
  isLoggedIn = (localStorage.getItem('token') && localStorage.getItem('id'));
  isHost = (localStorage.getItem('is_host') === 'true');

  constructor(private router: Router, private route: ActivatedRoute,
    private userService: UserService, private sanitizer: DomSanitizer, private modalService: NgbModal) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.userService.getGuest(this.id).subscribe(
        (guest) => {
          this.guest = guest;
          console.log(guest);
        },
        // (error) => console.log(error)
        (error) => window.location.replace('/home')
      );
    })
  }

  trustResource(i: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(i)
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
