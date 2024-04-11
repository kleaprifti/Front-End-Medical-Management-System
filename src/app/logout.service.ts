import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/dev-environment/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private logoutSubject = new Subject<void>();
  private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient,private router: Router) { }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.logoutSubject.next(); 
    return this.http.get(`${this.baseUrl}/logout`);
}

  getLogoutObservable() {
    return this.logoutSubject.asObservable();
  }
}
