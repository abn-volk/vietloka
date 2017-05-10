import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

@Injectable() 
export class RentService {
  private url = environment.server;
  constructor(private http: Http) {}

  getRent(id: string): Observable<any> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get(this.url + `/api/v1/rents/${id}`, {headers: h})
               .map(response => response.json());
  }

  postRent(id: string): Observable<any> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    let rent = {
      house: id,
      accepted: false,
      completed: false
    }
    return this.http.post(this.url + `/api/v1/rents/`, rent, {headers: h})
               .map(response => response.json());
  }


}