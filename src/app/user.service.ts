import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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


  addUser(request: RegisterRequest): Observable<User> {
    return this.http.post(this.url + '/api/v1/users', JSON.stringify(request), {headers: this.headers})
               .map(response => response.json() as User)
               .catch(error => Promise.reject(error.message || error));
  }

  updateUser(request: any): Observable<any> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.put(this.url + '/api/v1/users/' + localStorage.getItem('id'), JSON.stringify(request), {headers: h});
  }

  authenticate(email: string, password: String): Observable<string> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(email + ':' + password)
    });
    return this.http.post(this.url + '/auth', JSON.stringify({access_token: environment.masterKey}), {headers: h})
               .map(response => response.json().token);
  }

  getProfile(): Observable<User> {
    let h = new Headers({'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + '/api/v1/users/me', {headers: h})
               .map(response => response.json() as User);
  }

  isGuest(): Observable<User> {
    let h = new Headers({'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + '/api/v1/guests/self', {headers: h})
               .map(response => response.json() as User);
  }

  isHost(): Observable<User> {
    let h = new Headers({'Authorization': 'Bearer ' + localStorage.getItem('token')});
    return this.http.get(this.url + '/api/v1/hosts/self', {headers: h})
               .map(response => response.json() as User);
  }

  addGuest(request: any): Observable<User> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(this.url + '/api/v1/guests', JSON.stringify(request), {headers: h})
               .map(response => response.json() as User);
  }

  addHost(request: any): Observable<User> {
    let h = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(this.url + '/api/v1/hosts', JSON.stringify(request), {headers: h})
               .map(response => response.json() as User);
  }
}
