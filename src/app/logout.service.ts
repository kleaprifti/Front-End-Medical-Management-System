import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private logoutSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.logoutSubject.next(); 
    return this.http.get('/logout', {});
  }

  getLogoutObservable() {
    return this.logoutSubject.asObservable();
  }
}
