import { environment } from '@environments/prod-environment/environment.prod';
import { HostListener, Injectable,Injector,NgZone,TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SessionConfigService } from './session-config.service';
import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private sessionTimeout: number; 
  private lastActivity: number = Date.now();
  private username: string | null = null; 
  private timer: any;
  private timeoutSubject = new Subject<void>();
  private modalRef!: BsModalRef;
  private authService: LoginService | undefined;
  private sessionCheckActive = true; 

  constructor(private modalService: BsModalService,private zone: NgZone,private router: Router,private injector: Injector,private SessionConfigService: SessionConfigService
 ) {    this.sessionTimeout = this.SessionConfigService.getSessionTimeout();

 }
 getSessionTimeout(): number {
      return environment.sessionTimeout as number;
    }

 private getLoginService(): LoginService {
  return this.injector.get(LoginService);
}

    onUserActivity(): void {
      this.lastActivity = Date.now();
      // this.resetTimeout(); 
    }

    resetTimeout(): void {
      clearTimeout(this.timer);
  
      this.timer = setTimeout(() => {
        const isAuthenticated =this.getLoginService().isLoggedIn();
        if (this.sessionCheckActive && isAuthenticated && !this.isUserActive()) {
          console.log('Session timeout reached. Showing modal.');
          this.showTimeoutModal();
        }
      },this.sessionTimeout);
    }
 
    showTimeoutModal(): void {
      let userActionTaken = false;

  
    
      this.zone.run(() => {
        this.modalRef = this.modalService.show(SessionTimeoutComponent, {
          class: 'modal-dialog-centered',
          backdrop: 'static',
          keyboard: false,
        });
    
        this.modalRef.content.onContinue$.subscribe(() => {
          console.log('Continue button clicked. Resetting timeout.');
          this.resetSession();
          userActionTaken = true;
          this.modalRef.hide();
        });
    
        this.modalRef.content.onLogout$.subscribe(() => {
          console.log('Logout button clicked. Redirecting to login page.');
          this.getLoginService().setLoggedIn(false);
          this.router.navigate(['/']);
          this.modalRef.hide();
        });
      });
    
      setTimeout(() => {
        if (!userActionTaken) {
          console.log('No action taken. Redirecting to login page.');
          this.getLoginService().setLoggedIn(false);
          this.router.navigate(['/']);
          this.modalRef.hide(); 
        }
      }, 15000); 
    }
    resetSession(): void {
      this.lastActivity = Date.now();
      this.resetTimeout();
    }
    startSessionCheck(): void {
      this.resetTimeout();
    }

  setUsername(username: string): void {
 this.username=username; 
 sessionStorage.setItem('username', username); 
 }

  getUsername(): string | null {
    return this.username;
  }

  clearUsername(): void {
    this.username = null;
    sessionStorage.removeItem('username'); 

  }
  
  clearSession(): void {
    clearTimeout(this.timer); 
  }
  
  isSessionExpired(): boolean {
    const currentTime = Date.now();
    return currentTime - this.lastActivity > this.sessionTimeout;
  }
  
  isUserActive(): boolean {
    const currentTime = Date.now();
    return currentTime - this.lastActivity < this.sessionTimeout;
  }
  
  setSessionCheckActive(active: boolean): void {
    this.sessionCheckActive = active;
  }
}