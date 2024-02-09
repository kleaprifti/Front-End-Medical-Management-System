import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionManagementService {
  private isLoggedIn = false;

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedIn = value;
  }
}