import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionTimeoutService } from './session-timeout.service';

@Injectable()
export class SessionTimeoutInterceptor implements HttpInterceptor {

  constructor(private SessionTimeoutService: SessionTimeoutService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.SessionTimeoutService.resetSession();
    this.SessionTimeoutService.resetTimeout();
    return next.handle(request);
  }
}
