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


@Injectable()
export class HouseService {
  private url = environment.server;

  constructor(private http: Http) {}

  addHouse(request: any): Observable<any> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(this.url + '/api/v1/houses', JSON.stringify(request), {headers: h})
               .map(response => response.json());
    }

    getHouse(id: string): Observable<any> {
      let h = new Headers({
        'Content-Type': 'application/json'
      });

      return this.http.get(this.url + `/api/v1/houses/${id}`, {headers: h})
               .map(response => response.json() as House);
    }

    getAllHouses(): Observable<any> {
      let h = new Headers({
        'Content-Type': 'application/json'
      });
      return this.http.get(this.url + `/api/v1/houses`, {headers: h})
               .map(response => response.json() as Array<House>);
    }
}