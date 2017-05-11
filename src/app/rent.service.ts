import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

export class Rent {
  id: string;
  house: string;
  accepted: boolean;
  completed: boolean;
  createdAt: Date;
}

@Injectable()
export class RentService {
  private url = environment.server;
  constructor(private http: Http) {}
  h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

  getRent(id: string): Observable<any> {

    return this.http.get(this.url + `/api/v1/rents/${id}`, {headers: this.h})
               .map(response => response.json());
  }

  postRent(id: string): Observable<any> {
    let rent = {
      house: id,
      accepted: false,
      completed: false
    }
    return this.http.post(this.url + `/api/v1/rents/`, rent, {headers: this.h})
               .map(response => response.json());
  }

  postComment(req: any): Observable<Comment> {
    return this.http.post(this.url + '/api/v1/comments/', req, {headers: this.h})
               .map(response => response.json() as Comment);
  }

  leave(rentId: string): Observable<any> {
    return this.http.put(this.url + `/api/v1/rents/${rentId}/finish`, {}, {headers: this.h})
               .map(response => response.json());
  }

  getRentHistory(houseId: string): Observable<Array<Rent>> {
    return this.http.get(this.url + `/api/v1/houses/${houseId}/rent_history`, {headers: this.h})
               .map(response => response.json() as Array<Rent>);
  }

  getMyRents(): Observable<Array<Rent>> {
    let h = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + `/api/v1/rents/mine`, {headers: h})
             .map(response => response.json() as Array<Rent>);
  }

  getMyGuests() {
    let h = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + `/api/v1/rents/history`, {headers: h})
             .map(response => response.json() as Array<Rent>);
  }

}
