import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/dev-environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiUrl;
  private sessionKey =  'session';
  constructor(private http: HttpClient) { }
  authenticateUser(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${body.username}:${body.password}`)
        });
    return this.http.post(`${this.baseUrl}/login`, body,{ headers });
  }
  private loggedIn = true; 

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout(): void {
    this.loggedIn = false;
    sessionStorage.removeItem(this.sessionKey);
  }

  getSession(): any {
    const sessionString = sessionStorage.getItem(this.sessionKey);
    return sessionString ? JSON.parse(sessionString) : null;
  }

}