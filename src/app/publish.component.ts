import {Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component( {
  selector: 'publish-section',
  templateUrl: './publish.component.html',
})
export class PublishComponent {
  publishForm: FormGroup;
  publishing: boolean;
  networkError: boolean;  

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.buildForm();
    this.networkError = false;
    this.publishing = false;
  }

  buildForm(): void {
    this.publishForm = this.fb.group({
      'address': ['', [Validators.required]],
      'numOfMembers': [1, [Validators.required]],
      // TODO: complete this

    });
    this.publishForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.publishForm) return;
    const form = this.publishForm;
    
  }
}