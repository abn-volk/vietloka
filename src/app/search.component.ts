import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GeocodingService } from './geocoding.service';
import { LatLngBoundsLiteral } from "@agm/core";
import { House, HouseService } from "app/house.service";


@Component( {
  selector: 'search-section',
  templateUrl: './search.component.html',
  styleUrls: ['search.component.css']
})
export class SearchComponent {
  constructor(private route: ActivatedRoute, private router: Router,
    private houseService: HouseService, private geocodingService: GeocodingService) {}

  query = '';
  zoom: number = 6;
  lat: number = 18;
  lng: number = 105;
  houses: Array<House>;
  currentHouse: House;
  showInfo: boolean = false;
  // bounds: LatLngBoundsLiteral;

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['query']) {
        this.query = params['query'];
        this.submitSearch({query: this.query});
      }
    });
    this.houseService.getAllHouses().subscribe(
      (houses) => {
        this.houses = houses;
      }
    )
  }


  // After users press submit button
  submitSearch(value) {
    if (value.query) {
      this.geocodingService.find(value.query).subscribe(
        (data) => {
          this.lat = parseFloat(data.results[0].geometry.location.lat);
          this.lng = parseFloat(data.results[0].geometry.location.lng);
          // let bounds = data.results[0].geometry.viewport;
          // this.bounds = {north: parseFloat(bounds.northeast.lat),
          //                east: parseFloat(bounds.northeast.lng),
          //                south: parseFloat(bounds.southwest.lat),
          //                west: parseFloat(bounds.southwest.lng)}  as LatLngBoundsLiteral;
        }
      )
    }
  }
}
