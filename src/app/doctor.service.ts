import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
private backendUrl = '/users/doctors';
  constructor( private http: HttpClient) { }

  getDoctors(): Observable<any>{
    return this.http.get(this.backendUrl);
  }
}
