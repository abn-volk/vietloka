import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

export class RegisterRequest {
  access_token: string;
  email: string;
  password: string;
  name: string;
  picture: string;
  role: string;

  constructor(user: any) {
    this.access_token = environment.masterKey;
    this.email = user.email;
    this.password = user.password;
    this.name = user.name;
    this.picture = '';
    this.role = 'user';
  }
}

export class User {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: string;
  createdAt: Date;
  job: string;
  placeOfWork: string;
  phoneNumber: string;
  identityNumber: string;
  dateOfBirth: Date;
  gender: string;
}

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private url = environment.server;
  constructor(private http: Http) {}

  // Add a new user to the database
  addUser(request: RegisterRequest): Observable<User> {
    return this.http.post(this.url + '/api/v1/users', JSON.stringify(request), {headers: this.headers})
               .map(response => response.json() as User);
  }

  // Update data of the users in the verify page
  updateUser(request: any): Observable<any> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.put(this.url + '/api/v1/users/' + localStorage.getItem('id'), JSON.stringify(request), {headers: h});
  }

  // Check when users log in
  authenticate(email: string, password: String): Observable<string> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(email + ':' + password)
    });
    return this.http.post(this.url + '/auth', JSON.stringify({access_token: environment.masterKey}), {headers: h})
               .map(response => response.json().token);
  }

  // Get the data of the logged in user
  getProfile(): Observable<User> {
    let h = new Headers({'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + '/api/v1/users/me', {headers: h})
               .map(response => response.json() as User);
  }

  // Get the data of another user
  getUser(id: String): Observable<User> {
    let h = new Headers({
        'Content-Type': 'application/json'
      });
    return this.http.get(this.url + `/api/v1/users/${id}`, {headers: h})
               .map(response => response.json() as User);
  }

  // Get the data of a host
  getHost(id: String): Observable<any> {
    let h = new Headers({
        'Content-Type': 'application/json'
      });
    return this.http.get(this.url + `/api/v1/users/${id}/as_host`, {headers: h})
               .map(response => response.json());
  }

  // Get the data of a guest
  getGuest(id: String): Observable<any> {
    let h = new Headers({
        'Content-Type': 'application/json'
      });
    return this.http.get(this.url + `/api/v1/users/${id}/as_guest`, {headers: h})
               .map(response => response.json());
  }

  // Get all the house of a host
  getAllHostHouses(id: String): Observable<any> {
    let h = new Headers({
        'Content-Type': 'application/json'
      });
    return this.http.get(this.url + `/api/v1/users/${id}/houses`, {headers: h})
               .map(response => response.json());
  }

  // Check if user is a guest
  isGuest(): Observable<User> {
    let h = new Headers({'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + '/api/v1/guests/self', {headers: h})
               .map(response => response.json() as User);
  }

  // Check if user is a host
  isHost(): Observable<User> {
    let h = new Headers({'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + '/api/v1/hosts/self', {headers: h})
               .map(response => response.json() as User);
  }

  // Add a Guest object to database
  addGuest(request: any): Observable<User> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(this.url + '/api/v1/guests', JSON.stringify(request), {headers: h})
               .map(response => response.json() as User);
  }

  // Add a Host object to database
  addHost(request: any): Observable<User> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(this.url + '/api/v1/hosts', JSON.stringify(request), {headers: h})
               .map(response => response.json() as User);
  }
}
