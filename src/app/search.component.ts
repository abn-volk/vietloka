import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private houseService: HouseService, private geocodingService: GeocodingService) {}

  zoom: number = 6;
  lat: number = 18;
  lng: number = 105;
  houses: Array<House>;
  currentHouse: House;
  showInfo: boolean = false;
  loading: boolean = true;
  searchForm: FormGroup;
  searchResults: Array<any>;
  query: string;
  // bounds: LatLngBoundsLiteral;

  ngOnInit() {
    this.searchForm = this.fb.group({
        'query': ['', [Validators.required]]
      });

    this.searchForm.valueChanges.debounceTime(300)
        .subscribe(
          data => this.onQueryChanged(data)
        );
    this.searchForm.valueChanges.subscribe(
      data => this.query = this.searchForm.value.query
    )
    this.route.queryParams.subscribe((params: Params) => {
      if (params['query']) {
        this.searchForm.setValue({query: params['query']});
        this.submitSearch(null);
      }
    });
    this.houseService.getAllHouses().subscribe(
      (houses) => {
        this.houses = houses;
        this.loading = false;
      }
    )
  }

  onQueryChanged(data?: any): void {
    let q = this.searchForm.value.query;
    if (!!q && q.length > 0) {
      this.geocodingService.find(q).subscribe(
        (data) => {
          this.searchResults = data.results;
        }
      )
    }
    else this.searchResults = [];
  }

  chooseAddress(address: string) {
    this.searchResults = [];
    this.query = address;
    this.submitSearch(null);
  }


  // After users press submit button
  submitSearch(event: any) {
    if (this.query) {
      this.geocodingService.find(this.query).subscribe(
        (data) => {
          this.lat = parseFloat(data.results[0].geometry.location.lat);
          this.lng = parseFloat(data.results[0].geometry.location.lng);
          this.zoom = 10;
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
