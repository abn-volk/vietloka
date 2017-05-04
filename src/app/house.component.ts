import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HouseService } from './house.service' 

@Component( {
  selector: 'house-section',
  templateUrl: './house.component.html',
})
export class HouseComponent implements OnInit, OnDestroy{

  constructor(private router: Router, private route: ActivatedRoute, private houseService: HouseService) {}

  id: string;
  sub: any;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.houseService.getHouse(this.id).subscribe(
        (house) => console.log(house),
        (error) => console.log(error)
      );
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}