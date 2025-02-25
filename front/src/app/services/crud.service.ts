import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }

  corsHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3001/'
  });

  getAll(url) {
    console.log(url);
    return this.http.get<any>(url);
  }
  getAllWithParams(url, params) {
    console.log(url, params);
    return this.http.get<any>(url, {params});
  }
  getOne(url, id) {
    console.log(url);
    return this.http.get<any>(url + '/' + id);
  }
  post(url, body) {
    console.log(url);
    return this.http.post<any>(url, body);
  }
  postOpt(url, body, option) {
    console.log(url);
    return this.http.post<any>(url, body, option);
  }
  update(url, id, body) {
    console.log(url);
    return this.http.patch<any>(url + '/' + id, body,{observe: 'response' });
  }
  delete(url, id) {
    console.log(url);
    return this.http.delete<any>(url + '/' + id);
  }
  put(url, body) {
    console.log(url);
    return this.http.put<any>(url, body);
  }
}
