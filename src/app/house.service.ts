import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import { User } from "app/user.service";

export class House {
  id: string;
  owner: User;
  WC: string;
  address: string;
  title: string;
  numOfMember: string;
  hasChildren: boolean;
  hasOlders: boolean;
  area: number;
  price: number;
  numOfTotalSlots: number;
  hasElectricHeater: boolean;
  hasWashingMachine: boolean;
  hasTV: boolean;
  hasInternet: boolean;
  description: string;
  image: Array<string>;
  map: {
    lat: number;
    lng: number;
  };
}

export class Comment {
  rent: string;
  guest: string;
  title: string;
  content: string;
  approves: boolean;
}


@Injectable()
export class HouseService {
  private url = environment.server;
  h = new Headers({
    'Content-Type': 'application/json'
  });
  constructor(private http: Http) {}

  // Add a house object to database
  addHouse(request: any): Observable<any> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(this.url + '/api/v1/houses', JSON.stringify(request), {headers: h})
               .map(response => response.json());
    }

  // Get info of a house
  getHouse(id: string): Observable<any> {
    return this.http.get(this.url + `/api/v1/houses/${id}`, {headers: this.h})
             .map(response => response.json() as House);
  }

  // Get all the houses in the database
  getAllHouses(): Observable<any> {
    return this.http.get(this.url + `/api/v1/houses`, {headers: this.h})
             .map(response => response.json() as Array<House>);
  }

  // Get all the houses of logged in user, if he/she is a host
  getMyHouses(): Observable<Array<House>> {
    let h = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + `/api/v1/houses/mine`, {headers: h})
             .map(response => response.json() as Array<House>);
  }

  // Get all the reviews of a house
  getHouseComments(id: string): Observable<Array<Comment>> {
    return this.http.get(this.url + `/api/v1/houses/${id}/comments`, {headers: this.h})
               .map(response => response.json() as Array<Comment>);
  }

  // Get ratings of a house
  getHouseRatings(id: string): Observable<any> {
    return this.http.get(this.url + `/api/v1/houses/${id}/ratings`, {headers: this.h})
               .map(response => response.json());
  }
}
