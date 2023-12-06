import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.get<any>(`${this.apiUrl}/login`).pipe(
      tap((response: { username: string; token: string }) => {
        if (response) {
          localStorage.setItem('username', response.username);
          localStorage.setItem('token', response.token); 
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('username') && !!localStorage.getItem('token');
  }
}
