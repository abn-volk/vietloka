import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';


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
               .map(response => response.json());
    }
}