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

  constructor(private http: HttpClient, private router: Router,private sessionService:SessionTimeoutService) { }

  authenticateUser(username: string, password: string): Observable<any> {
    const body = { username, password };
    this.loggedIn = true;
    this.sessionService.setSessionCheckActive(false);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${body.username}:${body.password}`)
    });

    return this.http.post(`${this.baseUrl}/login`, body, { headers }).pipe(
      tap(() => {
        this.sessionService.setSessionCheckActive(true); // Enable session check after successful login
        this.sessionService.setUsername(username);
        this.sessionService.startSessionCheck();
      })
    );
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