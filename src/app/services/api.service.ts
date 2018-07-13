import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class ApiService {
  url: any = {
    barclaysAtm: environment.barclaysApi,
    natwestAtm: environment.natwestApi
  };


  constructor(public http: HttpClient) {
  }

  get(service: string, endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }
    // Support multiple easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let i = 0; i < params.length; i++) {
        for (const k of Object.keys(params[i])) {
          reqOpts.params = reqOpts.params.set(k, params[i][k]);
        }
      }
    }

    return this.http.get(this.url[service] + '/' + endpoint, reqOpts);
  }


  externalGet(endpoint: string, params?: any, reqOpts?: any) {

    return this.http.jsonp(this.url.barclaysAtm, '');
  }

  post(service: string, endpoint: string, body: any, reqOpts?: any) {
    const _reqOpts = {
      headers: new HttpHeaders()
    };
    if (reqOpts) {
      _reqOpts.headers = new HttpHeaders();
      for (const k of Object.keys(reqOpts)) {
        _reqOpts.headers = _reqOpts.headers.set(k, reqOpts[k]);
      }
    }

    return this.http.post(this.url[service] + '/' + endpoint, body, _reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }
}
