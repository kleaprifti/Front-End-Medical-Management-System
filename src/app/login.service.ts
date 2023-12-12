// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { environment } from '@environments/dev-environment/environment.development';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService {
//   private baseUrl = environment.apiUrl;
//   private sessionKey = 'session';
//   private sessionTimeout = 30 * 1000; 

//   constructor(private http: HttpClient) { }

//   authenticateUser(username: string, password: string): Observable<any> {
//     const body = { username, password };
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': 'Basic ' + btoa(`${body.username}:${body.password}`)
//     });

//     return this.http.post(`${this.baseUrl}/login`, body, { headers }).pipe(
//       tap(() => {
//         this.setLoggedIn();
//       })
//     );
//   }

//   private loggedIn = false;

//   isLoggedIn(): boolean {
//     return this.loggedIn;

//   }

//   setLoggedIn(): void {
//     this.loggedIn = true;
//     setTimeout(() => {
//       this.logout();
//     }, this.sessionTimeout);
//   }

//   logout(): void {
//     this.loggedIn = false;
//     sessionStorage.removeItem(this.sessionKey);
//   }

//   getSession(): any {
//     const sessionString = sessionStorage.getItem(this.sessionKey);
//     return sessionString ? JSON.parse(sessionString) : null;
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@environments/dev-environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiUrl;
  private sessionKey = 'session';
  private sessionTimeout = 30 * 1000;

  constructor(private http: HttpClient) { }

  authenticateUser(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${body.username}:${body.password}`)
    });

    return this.http.post(`${this.baseUrl}/login`, body, { headers }).pipe(
      tap(() => {
        this.setLoggedIn();
        this.saveSession({ username });
      })
    );
  }

  private loggedIn = false;

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  setLoggedIn(): void {
    this.loggedIn = true;
    setTimeout(() => {
      this.logout();
    }, this.sessionTimeout);
  }

  logout(): void {
    this.loggedIn = false;
    sessionStorage.removeItem(this.sessionKey);
  }

  getSession(): any {
    return this.loggedIn ? this.retrieveSession() : null;
  }

  private saveSession(sessionData: any): void {
    sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
  }

  private retrieveSession(): any {
    const sessionString = sessionStorage.getItem(this.sessionKey);
    return sessionString ? JSON.parse(sessionString) : null;
  }
}
