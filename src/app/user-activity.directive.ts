import { Directive, HostListener } from '@angular/core';
import { SessionTimeoutService } from './session-timeout.service';

@Directive({
  selector: '[appUserActivity]'
})
export class UserActivityDirective {

  constructor(private SessionTimeoutService:SessionTimeoutService) { }
  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:keydown', ['$event'])
  onUserActivity(event: MouseEvent | KeyboardEvent): void {
    this.SessionTimeoutService.onUserActivity();
  }

}
