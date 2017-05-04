import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  

  constructor(private fb: FormBuilder, private svc: HouseService, private modalService: NgbModal, private geocodingService: GeocodingService) {}
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.publishForm = this.fb.group({
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

  onValueChanged(data?: any) {
    if (!this.publishForm) return;
    const form = this.publishForm;
    
  }

  doPublish(event: any) {
    const v = this.publishForm.value;
    let req = {
      owner: localStorage.getItem('token'),
      address: v.address,
      price: v.price,
      numOfMember: v.numOfMembers,
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
    }

    this.svc.addHouse(req).subscribe(
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

  markerDragEnd(m: any, $event: any) {
    this.latMarker = $event.coords.lat;
    this.lngMarker = $event.coords.lng;
  
  }

  showMap() {
    this.mapModalRef = this.modalService.open(this.mapModal);
  }

  closeMap() {
    this.mapModalRef.close();
  }

  saveMapLatLng() {
    this.publishForm.patchValue({lat: this.latMarker});
    this.publishForm.patchValue({lng: this.lngMarker});
    this.closeMap();
  }

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


  gotoHouse(id: number) {
    // id: "590b5fccd378200d12c4edb5"
  }


}