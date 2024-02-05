import { Injectable } from '@angular/core';
import { environment } from '@environments/dev-environment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SessionConfigService {

  constructor() { }
  getSessionTimeout(): number {
    return environment.sessionTimeout as number;
  }
}
