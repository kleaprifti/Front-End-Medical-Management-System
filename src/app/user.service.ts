import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) { }

  getDoctors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?userRole=DOCTOR`);
  }
  getPatients(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?userRole=PATIENT`);
  }

}