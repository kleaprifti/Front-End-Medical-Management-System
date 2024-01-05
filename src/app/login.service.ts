// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, catchError, tap, throwError } from 'rxjs';
// import { environment } from '@environments/dev-environment/environment.development';
// import { Router } from '@angular/router';
// import * as CryptoJS from 'crypto-js';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService {
//   private readonly baseUrl = environment.apiUrl;
//   private readonly sessionKey = 'session';
//   private readonly rememberMeKey = 'rememberMe';
//   private readonly credentialsKey = 'credentials';
//   private readonly sessionTimeout = 30 * 1000;

//   private loggedIn = false;
//   private sessionTimeoutId: any;

//   constructor(private http: HttpClient, private router: Router) {}

//   authenticateUser(username: string, password: string, rememberMe: boolean): Observable<any> {
//     const hashedPassword = this.hashPassword(password);
//     const credentials = { username, password };
  
//     console.log('Attempting login for user:', username);
  
//     if (rememberMe) {
//       this.saveCredentials(credentials);
//     } else {
//       console.log('Decoded password for debugging:', this.decodePassword(hashedPassword));
//     }
  
//     console.log('Encrypted password sent to server:', hashedPassword);
  
//     return this.http.post<any>(`${this.baseUrl}/login`, credentials, { headers: this.createHeaders(credentials) }).pipe(
//       tap((response) => {
//         console.log('Login successful!');
//         this.setLoggedIn();
//         this.router.navigate(['/appointment-list']);
//       }),
//       catchError(error => {
//         console.error('Login error:', error);
//         return throwError(error);
//       })
//     );
//   }
  

//   private hashPassword(password: string): string {
//     return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
//   }

//   private decodePassword(encodedPassword: string): string {
//     const bytes = CryptoJS.enc.Base64.parse(encodedPassword);
//     return bytes.toString(CryptoJS.enc.Utf8);
//   }

//   isLoggedIn(): boolean {
//     return this.loggedIn;
//   }

//   setLoggedIn(): void {
//     this.loggedIn = true;
//     this.sessionTimeoutId = setTimeout(() => {
//       this.logout();
//       this.router.navigate(['/']);
//     }, this.sessionTimeout);
//   }

//   logout(): void {
//     this.loggedIn = false;
//     clearTimeout(this.sessionTimeoutId);
//     sessionStorage.removeItem(this.sessionKey);
//   }

//   getSession(): any {
//     return this.loggedIn ? this.retrieveSession() : null;
//   }

//   saveCredentials(credentials: { username: string, password: string }): void {
//     localStorage.setItem(this.rememberMeKey, 'true');
//     localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
//   }

//   retrieveCredentials(): { username: string, password: string } | null {
//     const rememberMe = localStorage.getItem(this.rememberMeKey) === 'true';
//     return rememberMe ? JSON.parse(localStorage.getItem(this.credentialsKey) || '{}') : null;
//   }

//   clearCredentials(): void {
//     localStorage.removeItem(this.rememberMeKey);
//     localStorage.removeItem(this.credentialsKey);
//   }

//   private saveSession(sessionData: any): void {
//     sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
//   }

//   private retrieveSession(): any {
//     const sessionString = sessionStorage.getItem(this.sessionKey);
//     return sessionString ? JSON.parse(sessionString) : null;
//   }

//   private createHeaders(body: any): HttpHeaders {
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Basic ${btoa(`${body.username}:${body.password}`)}`
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '@environments/dev-environment/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
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
    const credentials = { username, password };
  
    this.setRememberMe(rememberMe, credentials);
  
    return this.http.post<any>(`${this.baseUrl}/login`, credentials, {
      headers: this.createHeaders(credentials),
    }).pipe(
      tap((sessionData) => this.handleSuccessfulLogin(rememberMe, credentials, sessionData)),
      catchError((error) => this.handleLoginError(error))
    );
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  private handleSuccessfulLogin(
    rememberMe: boolean,
    credentials: { username: string, password: string },
    sessionData: any
  ): void {
    this.onLoginSuccess();

    if (rememberMe) {
      this.saveCredentialsLocally(credentials);
    }

    this.saveSession(sessionData);
  }

  private onLoginSuccess(): void {
    console.log('Login successful!');
    this.setLoggedIn();
    this.router.navigate(['/appointment-list']);
  }

  private handleLoginError(error: any): Observable<never> {
    console.error('Login error:', error);
    return throwError(error);
  }

  private setLoggedIn(): void {
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

  private saveCredentialsLocally(credentials: { username: string, password: string }): void {
    localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
  }

  retrieveCredentials(): { username: string, password: string } | null {
    const storedCredentials = localStorage.getItem(this.credentialsKey);

    return storedCredentials ? JSON.parse(storedCredentials) : null;
  }

  clearCredentials(): void {
    localStorage.removeItem(this.credentialsKey);
  }

  private saveSession(sessionData: any): void {
    sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
  }

  private retrieveSession(): any {
    const sessionString = sessionStorage.getItem(this.sessionKey);
    return sessionString ? JSON.parse(sessionString) : null;
  }
  setRememberMe(rememberMe: boolean, credentials: { username: string, password: string }): void {
    if (rememberMe) {
      this.saveCredentialsLocally(credentials);
    } else {
      this.clearCredentials();
    }
  }
  private createHeaders(body: any): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${body.username}:${body.password}`)}`,
    });
  }
}