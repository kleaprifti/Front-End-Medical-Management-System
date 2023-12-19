import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@environments/dev-environment/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly baseUrl = environment.apiUrl;
  private readonly sessionKey = 'session';
  private readonly rememberMeKey = 'rememberMe';
  private readonly credentialsKey = 'credentials';
  private readonly sessionTimeout = 30 * 1000;

  private loggedIn = false;
  private sessionTimeoutId: any;

  constructor(private http: HttpClient, private router: Router) {}

  authenticateUser(username: string, password: string, rememberMe: boolean): Observable<any> {
    const body = { username, password };
    const headers = this.createHeaders(body);

    return this.http.post(`${this.baseUrl}/login`, body, { headers }).pipe(
      tap(() => {
        this.setLoggedIn();
        this.saveSession({ username });
        if (rememberMe) {
          this.saveCredentials({ username, password });
        } else {
          this.clearCredentials();
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setLoggedIn(): void {
    this.loggedIn = true;
    this.sessionTimeoutId = setTimeout(() => {
      this.logout();
      this.router.navigate(['/']);
    }, this.sessionTimeout);
  }

  logout(): void {
    this.loggedIn = false;
    clearTimeout(this.sessionTimeoutId);
    sessionStorage.removeItem(this.sessionKey);
  }

  getSession(): any {
    return this.loggedIn ? this.retrieveSession() : null;
  }

  saveCredentials(credentials: { username: string, password: string }): void {
    localStorage.setItem(this.rememberMeKey, 'true');
    localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
  }

  retrieveCredentials(): { username: string, password: string } | null {
    const rememberMe = localStorage.getItem(this.rememberMeKey) === 'true';
    return rememberMe ? JSON.parse(localStorage.getItem(this.credentialsKey) || '{}') : null;
  }

  clearCredentials(): void {
    localStorage.removeItem(this.rememberMeKey);
    localStorage.removeItem(this.credentialsKey);
  }

  private saveSession(sessionData: any): void {
    sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
  }

  private retrieveSession(): any {
    const sessionString = sessionStorage.getItem(this.sessionKey);
    return sessionString ? JSON.parse(sessionString) : null;
  }

  private createHeaders(body: any): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${body.username}:${body.password}`)}`
    });
  }
}
