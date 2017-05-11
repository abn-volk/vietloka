import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class GeocodingService {
  constructor(private http: Http) {}

  url = 'https://maps.googleapis.com/maps/api/geocode/json'

  find(address: string) : Observable<any>{
    let params = new URLSearchParams();
    params.set('key', 'AIzaSyDGwHWYBuey33KjRe7J9xqyHnZLPTXe6JA');
    params.set('address', address);
    let options = new RequestOptions();
    options.search = params;
    return this.http.get(this.url, options).map(response => <any> response.json());
  }
}
