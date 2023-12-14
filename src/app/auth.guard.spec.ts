import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { LoginService } from './login.service';

class MockLoginService {
  isLoggedIn(): boolean {
    // Mock the isLoggedIn method as needed for testing
    return false;
  }
}

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;
  let loginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, { provide: LoginService, useClass: MockLoginService }],
    });
  });

  beforeEach(inject([AuthGuard, Router, LoginService], (guard: AuthGuard, r: Router, ls: LoginService) => {
    authGuard = guard;
    router = r;
    loginService = ls;
  }));

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation when the user is logged in', () => {
    spyOn(loginService, 'isLoggedIn').and.returnValue(true);

    const canActivate = authGuard.canActivate(null!, null!);

    expect(canActivate).toBe(true);
  });

  it('should redirect to the default route when the user is not logged in', () => {
    spyOn(loginService, 'isLoggedIn').and.returnValue(false);
    spyOn(router, 'navigate');

    const canActivate = authGuard.canActivate(null!, null!);

  
    });
  });