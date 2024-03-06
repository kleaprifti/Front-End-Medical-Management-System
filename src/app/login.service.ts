import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@environments/dev-environment/environment.development';
import { SessionTimeoutService } from './session-timeout.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiUrl;
  private loggedIn = false;
  private tokenKey= "secret";
  private rememberMe= false;

  constructor(private http: HttpClient, private router: Router,private sessionService:SessionTimeoutService) { }

  authenticateUser(username: string, password: string): Observable<any> {
    const body = { username, password };
    this.loggedIn = true;
    this.sessionService.setSessionCheckActive(false);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${body.username}:${body.password}`)
    });

    return this.http.post(`${this.baseUrl}/login`, body, { headers })
      .pipe(

        tap((response: any) => {
        this.sessionService.setSessionCheckActive(true);
        this.sessionService.setUsername(username);
        this.sessionService.startSessionCheck();
          if (response && response.token) {
            if (this.rememberMe) {
              localStorage.setItem('Name', response.firstName);
              localStorage.setItem('token', response.token);
              localStorage.setItem(this.tokenKey, response.token);
            }
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(){
    return this.loggedIn;
  }
  setLoggedIn(status:boolean): void {
    this.loggedIn = status;
  }

  logout(): void {
    this.loggedIn = false;
    this.sessionService.clearUsername();
    this.router.navigate(['/']);
  }


  startSessionCheck(): void {
    if (this.loggedIn) {
      this.sessionService.startSessionCheck();
    }
  }

}