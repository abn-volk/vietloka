import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HouseService } from './house.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component( {
  selector: 'publish-section',
  templateUrl: './publish.component.html',
})
export class PublishComponent {
  @ViewChild('content') content; 
  publishForm: FormGroup;
  publishing: boolean;
  networkError: boolean;  
  id: number;
  modalRef: NgbModalRef;

  constructor(private fb: FormBuilder, private svc: HouseService, private modalService: NgbModal) {}
  ngOnInit(): void {
    this.buildForm();
    this.networkError = false;
    this.publishing = false;
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

  gotoHouse(id: number) {

  }
}