import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.createLoginForm();
  }

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const enteredUsername = this.loginForm.get('username')?.value || '';
    const enteredPassword = this.loginForm.get('password')?.value || '';

    this.authService.login(enteredUsername, enteredPassword).subscribe(
      this.handleLoginSuccess.bind(this),
      this.handleLoginError.bind(this)
    );
  }

  private handleLoginSuccess(response: any): void {
    console.log('Login successful', response);
    this.router.navigate(['localhost:8080/appointments']);
  }

  private handleLoginError(error: any): void {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      console.error('Login failed: Unauthorized', error);
    } else {
      console.error('Login failed', error);
    }
  }
}
