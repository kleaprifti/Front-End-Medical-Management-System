import { Injectable } from '@angular/core';
import { environment } from '@environments/prod-environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {

  constructor() { }
  getSessionTimeout(): number {
    return environment.sessionTimeout as number;
  }
}
