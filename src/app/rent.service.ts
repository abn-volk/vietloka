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

  // Get a deal between a guest and a host
  getRent(id: string): Observable<any> {

    return this.http.get(this.url + `/api/v1/rents/${id}`, {headers: this.h})
               .map(response => response.json());
  }

  // Create a deal if guests want to stay at hosts' house
  postRent(id: string): Observable<any> {
    let rent = {
      house: id,
      accepted: false,
      completed: false
    }
    return this.http.post(this.url + `/api/v1/rents/`, rent, {headers: this.h})
               .map(response => response.json());
  }

  // Guests review about hosts' houses
  postComment(req: any): Observable<Comment> {
    return this.http.post(this.url + '/api/v1/comments/', req, {headers: this.h})
               .map(response => response.json() as Comment);
  }

  // Guests finish their trips, no longer need to stay at hosts' house
  leave(rentId: string): Observable<any> {
    return this.http.put(this.url + `/api/v1/rents/${rentId}/finish`, {}, {headers: this.h})
               .map(response => response.json());
  }

  // Get all the deals a guest want to make or already made
  getRentHistory(houseId: string): Observable<Array<Rent>> {
    return this.http.get(this.url + `/api/v1/houses/${houseId}/rent_history`, {headers: this.h})
               .map(response => response.json() as Array<Rent>);
  }

  // Get all the deals user want to make or already made, if he/she is a guest
  getMyRents(): Observable<Array<Rent>> {
    let h = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + `/api/v1/rents/mine`, {headers: h})
             .map(response => response.json() as Array<Rent>);
  }

  // Get all the deals that want to deal with the user, if he/she is a host
  getMyGuests() {
    let h = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + `/api/v1/rents/history`, {headers: h})
             .map(response => response.json() as Array<Rent>);
  }

}
