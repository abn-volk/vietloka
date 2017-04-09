import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/toPromise';

export class UserRequest {
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
  password: string;
  name: string;
  picture: string;
  role: string;
  createdAt: Date;
}

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private url = environment.server;
  constructor(private http: Http) {}


  addUser(user: UserRequest): Promise<User> {
    return this.http.post(this.url + '/api/v1/users', JSON.stringify(user), {headers: this.headers})
               .toPromise().then(response => response.json() as User)
               .catch(error => Promise.reject(error.message || error));
  }
}