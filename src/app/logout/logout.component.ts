import { Component } from '@angular/core';
import { LoginService } from '@app/login.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
    constructor(private loginService: LoginService) {}
  
    isLoggedIn(): boolean {
      return this.loginService.isLoggedIn();
    }
  
    getUsernameFromSession(): string | null {
      const session = this.loginService.getSession();
      return session ? session.username : this.getUsernameFromSession;
    }
  
    logout(): void {
      this.loginService.logout();
    }
  }
