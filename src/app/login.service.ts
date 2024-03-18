import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@environments/dev-environment/environment.development';
import { SessionTimeoutService } from './session-timeout.service';
import { Router } from '@angular/router';
import { JwtResponse } from './jwt-response';
import { LoginInfoDto } from './login-info.dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiUrl;
  private loggedIn = false;
  private tokenKey= "secret";
  private token!: string;
  private rememberMe= false;

  constructor(private http: HttpClient, private router: Router,private sessionService:SessionTimeoutService) { }
  
  createAuthenticationToken(username: string, password: string): Observable<JwtResponse> {
    const body = { username, password };
    return this.http.post<JwtResponse>(`${this.baseUrl}/login`, body);
  }

  authenticateUser(username: string, password: string): Observable<any> {
    const body = { username, password };
    this.loggedIn = true;
    this.sessionService.setSessionCheckActive(false);
    const storedToken = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${body.username}:${body.password}`)
    });

    return this.http.post(`${this.baseUrl}/login`, body, { headers })
      .pipe(

        tap((response: any) => {
        this.token = response.token;
        this.sessionService.setSessionCheckActive(true);
        this.sessionService.setUsername(username);
        this.sessionService.startSessionCheck();
        localStorage.setItem('token', this.token);
         
        })
      );
  }


  getToken(): string | null {
    return localStorage.getItem('token');
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
    this.clearToken(); 
    this.router.navigate(['/']);
  }


  startSessionCheck(): void {
    if (this.loggedIn) {
      this.sessionService.startSessionCheck();
    }
  }

}