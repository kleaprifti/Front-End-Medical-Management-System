import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/dev-environment/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private logoutSubject = new Subject<void>();
  router: any;
  private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.logoutSubject.next(); 
    return this.http.get(`${this.baseUrl}/logout`).subscribe(() => {
      this.router.navigate(['/login']); 
    });
  }
  getLogoutObservable() {
    return this.logoutSubject.asObservable();
  }
}
