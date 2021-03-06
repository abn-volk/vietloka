import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HouseService } from './house.service';
import { GeocodingService } from './geocoding.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component( {
  selector: 'publish-section',
  templateUrl: './publish.component.html',
})
export class PublishComponent {
  @ViewChild('content') content;
  @ViewChild('mapModal') mapModal;
  publishForm: FormGroup;
  publishing: boolean = false;
  networkError: boolean = false;
  id: number;
  modalRef: NgbModalRef;
  mapModalRef: NgbModalRef;
  lat: number = 21.03;
  lng: number = 105.83;
  latMarker: number = 21.03;
  lngMarker: number = 105.83;
  zoom: number = 7;
  query: string;
  draggable: boolean = true;


  constructor(private fb: FormBuilder, private router: Router, private houseService: HouseService,
     private modalService: NgbModal, private geocodingService: GeocodingService) {}
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.publishForm = this.fb.group({
      'title': ['', [Validators.required]],
      'address': ['', [Validators.required]],
      'lat': [0, [Validators.required]],
      'lng': [0, [Validators.required]],
      'price': [50000, [Validators.required]],
      'numOfMember': [1, [Validators.required]],
      'hasChildren': [false],
      'hasOlders': [false],
      'numOfTotalSlots': [1, [Validators.required]],
      'area': [10, [Validators.required]],
      'hasElectricHeater': [false],
      'hasWashingMachine': [false],
      'hasTV': [false],
      'hasCarPark': [false],
      'hasInternet': [false],
      'WC': ['None', [Validators.required]],
      'description': [''],
      'images':['']
    });
    this.publishForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  // In this version, when users type in these properties and then delete all the
  // content and left those blank, the website will display the error message
  // Need to find a new function for formErrors so that if users left those blank,
  // the website will display the error message immediately in the next version

  // Set validation message when users start to type in
  onValueChanged(data?: any) {
    if (!this.publishForm) return;
    const form = this.publishForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = 'This field is obligatory.';
      }
    }
  }

  // Form errors, errors when users left a required field blank
  formErrors = {
    'title': '',
    'address': '',
    'lat': '',
    'lng': '',
    'price': '',
    'numOfMember': '',
    'numOfTotalSlots': '',
    'area': '',
  };

  // After users press publish button
  doPublish(event: any) {
    const v = this.publishForm.value;
    let req = {
      title: v.title,
      owner: localStorage.getItem('id'),
      address: v.address,
      price: v.price,
      numOfMember: v.numOfMember,
      hasChildren: v.hasChildren,
      hasOlders: v.hasOlders,
      numOfTotalSlots: v.numOfTotalSlots,
      area: v.area,
      hasElectricHeater: v.hasElectricHeater,
      hasWashingMachine: v.hasWashingMachine,
      hasTV: v.hasTV,
      hasCarPark: v.hasCarPark,
      hasInternet: v.hasInternet,
      WC: v.WC,
      description: v.description,
      image: v.images.split(','),
      map : {
        lat: v.lat,
        lng: v.lng
      }
    };

    // After the house was added to the database
    this.houseService.addHouse(req).subscribe(
      (res) => {
        this.id = res.id;
        this.modalRef = this.modalService.open(this.content);
                setTimeout(() => this.gotoHouse(this.id), 3000);
      },
      (err) => {
        this.networkError = true;
      }
    );
  }

  // Hosts submit their locations for the system to search for
  // Output: the latitude and longtitude of the location
  submitSearch(value) {
    if (value.query) {
      this.geocodingService.find(value.query).subscribe(
        (data) => {
          this.lat = this.latMarker = parseFloat(data.results[0].geometry.location.lat);
          this.lng = this.lngMarker =  parseFloat(data.results[0].geometry.location.lng);
        }
      )
    }
  }

  // Hosts drag the marker to their location on map
  // Output: the latitude and longtitude of the location
  markerDragEnd(m: any, $event: any) {
    this.latMarker = $event.coords.lat;
    this.lngMarker = $event.coords.lng;

  }

  // Open map dialog
  showMap() {
    this.mapModalRef = this.modalService.open(this.mapModal);
  }

  // Close map dialog
  closeMap() {
    this.mapModalRef.close();
  }

  // Save the latitude and long titude of the location to
  // the latitude and longtitude field in the publish form
  saveMapLatLng() {
    this.publishForm.patchValue({lat: this.latMarker});
    this.publishForm.patchValue({lng: this.lngMarker});
    this.closeMap();
  }

  // Go to the page of the house just added
  gotoHouse(id: number) {
    this.modalRef.close();
    this.router.navigateByUrl(`house/${id}`);
  }


}
