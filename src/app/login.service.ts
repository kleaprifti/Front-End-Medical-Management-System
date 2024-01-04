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
//     const encryptedPassword = this.encryptPassword(password);
//     const body = { username, password: encryptedPassword };

//     // Log the encrypted password on the server side
//     this.logEncryptedPassword(encryptedPassword);

//     if (rememberMe) {
//       this.saveCredentials({ username, password: encryptedPassword });
//     }

//     return this.http.post<any>(`${this.baseUrl}/login`, body, { headers: this.createHeaders(body) }).pipe(
//       tap((response:any) => {
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

//   private encryptPassword(password: string): string {
//     const encrypted = CryptoJS.AES.encrypt(password, 'secretKey').toString();
//     return encrypted;
//   }

//   logEncryptedPassword(encryptedPassword: string): void {
//     console.log('Encrypted Password:', this.maskPassword(encryptedPassword));
//   }
  
//   private maskPassword(password: string): string {
//     return '********';
//   }
  
//   // authenticateUser(username: string, password: string, rememberMe: boolean): Observable<any> {
//   //   const body = { username, password };
//   //   const headers = this.createHeaders(body);

//   //   return this.http.post(`${this.baseUrl}/login`, body, { headers }).pipe(
//   //     tap(() => {
//   //       this.setLoggedIn();
//   //       this.saveSession({ username });
//   //       if (rememberMe) {
//   //         this.saveCredentials({ username, password });
//   //       } else {
//   //         this.clearCredentials();
//   //       }
//   //     })
//   //   );
//   // }

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
// // import { Injectable } from '@angular/core';
// // import { HttpClient, HttpHeaders } from '@angular/common/http';
// // import { Observable, catchError, tap, throwError } from 'rxjs';
// // import { environment } from '@environments/dev-environment/environment.development';
// // import { Router } from '@angular/router';
// // import * as CryptoJS from 'crypto-js';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class LoginService {
// //   private readonly baseUrl = environment.apiUrl;
// //   private readonly sessionKey = 'session';
// //   private readonly rememberMeKey = 'rememberMe';
// //   private readonly credentialsKey = 'credentials';
// //   private readonly sessionTimeout = 30 * 1000;

// //   private loggedIn = false;
// //   private sessionTimeoutId: any;

// //   constructor(private http: HttpClient, private router: Router) {}

// //   authenticateUser(username: string, password: string, rememberMe: boolean): Observable<any> {
// //     const hashedPassword = this.hashPassword(password);
// //     const credentials = { username, password };
  
// //     console.log('Attempting login for user:', username);
  
// //     if (rememberMe) {
// //       this.saveCredentials(credentials);
// //     } else {
// //       console.log('Decoded password for debugging:', this.decodePassword(hashedPassword));
// //     }
  
// //     console.log('Encrypted password sent to server:', hashedPassword);
  
// //     return this.http.post<any>(`${this.baseUrl}/login`, credentials, { headers: this.createHeaders(credentials) }).pipe(
// //       tap((response) => {
// //         console.log('Login successful!');
// //         this.setLoggedIn();
// //         this.router.navigate(['/appointment-list']);
// //       }),
// //       catchError(error => {
// //         console.error('Login error:', error);
// //         return throwError(error);
// //       })
// //     );
// //   }
  

// //   private hashPassword(password: string): string {
// //     return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
// //   }

// //   private decodePassword(encodedPassword: string): string {
// //     const bytes = CryptoJS.enc.Base64.parse(encodedPassword);
// //     return bytes.toString(CryptoJS.enc.Utf8);
// //   }

// //   isLoggedIn(): boolean {
// //     return this.loggedIn;
// //   }

// //   setLoggedIn(): void {
// //     this.loggedIn = true;
// //     this.sessionTimeoutId = setTimeout(() => {
// //       this.logout();
// //       this.router.navigate(['/']);
// //     }, this.sessionTimeout);
// //   }

// //   logout(): void {
// //     this.loggedIn = false;
// //     clearTimeout(this.sessionTimeoutId);
// //     sessionStorage.removeItem(this.sessionKey);
// //   }

// //   getSession(): any {
// //     return this.loggedIn ? this.retrieveSession() : null;
// //   }

// //   saveCredentials(credentials: { username: string, password: string }): void {
// //     localStorage.setItem(this.rememberMeKey, 'true');
// //     localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
// //   }

// //   retrieveCredentials(): { username: string, password: string } | null {
// //     const rememberMe = localStorage.getItem(this.rememberMeKey) === 'true';
// //     return rememberMe ? JSON.parse(localStorage.getItem(this.credentialsKey) || '{}') : null;
// //   }

// //   clearCredentials(): void {
// //     localStorage.removeItem(this.rememberMeKey);
// //     localStorage.removeItem(this.credentialsKey);
// //   }

// //   private saveSession(sessionData: any): void {
// //     sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
// //   }

// //   private retrieveSession(): any {
// //     const sessionString = sessionStorage.getItem(this.sessionKey);
// //     return sessionString ? JSON.parse(sessionString) : null;
// //   }

// //   private createHeaders(body: any): HttpHeaders {
// //     return new HttpHeaders({
// //       'Content-Type': 'application/json',
// //       'Authorization': `Basic ${btoa(`${body.username}:${body.password}`)}`
// //     });
// //   }
// // }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '@environments/dev-environment/environment.development';
import * as CryptoJS from 'crypto-js';

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

  constructor(private http: HttpClient) {}

  authenticateUser(username: string, password: string, rememberMe: boolean): Observable<any> {
    const encryptedPassword = this.encryptPassword(password);
    const body = { username, password: encryptedPassword };

    this.logEncryptedPassword(encryptedPassword);

    if (rememberMe) {
      this.saveCredentials({ username, password: encryptedPassword });
    }

    return this.http.post<any>(`${this.baseUrl}/login`, body, { headers: this.createHeaders() }).pipe(
      tap((response: any) => {
        console.log('Login successful!');
        this.setLoggedIn();
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  private encryptPassword(password: string): string {
    return CryptoJS.AES.encrypt(password, 'secretKey').toString();
  }

  private logEncryptedPassword(encryptedPassword: string): void {
    console.log('Encrypted Password:', this.maskPassword(encryptedPassword));
  }

  private maskPassword(password: string): string {
    return '********';
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setLoggedIn(): void {
    this.loggedIn = true;
    this.sessionTimeoutId = setTimeout(() => {
      this.logout();
    }, this.sessionTimeout);
  }

  logout(): void {
    this.loggedIn = false;
    clearTimeout(this.sessionTimeoutId);
    sessionStorage.removeItem(this.sessionKey);
  }

  private saveCredentials(credentials: { username: string, password: string }): void {
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

  getSession(): any {
    return this.loggedIn ? this.retrieveSession() : null;
  }

  private retrieveSession(): any {
    const sessionString = sessionStorage.getItem(this.sessionKey);
    return sessionString ? JSON.parse(sessionString) : null;
  }

  private createHeaders(): HttpHeaders {
    const credentials = this.retrieveCredentials();
    if (credentials) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }
}
