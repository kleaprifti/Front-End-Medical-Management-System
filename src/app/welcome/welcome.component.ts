import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  loginForm!: FormGroup;
  username: string = 'romeisaaliu1@gmail.com';
  password: string = 'password';
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.createLoginForm();
  }

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]],
      password: ['', Validators.required],
    });
  }
  login(): void {
    if (this.loginForm.valid) {
      const enteredUsername = this.loginForm.value.username;
      const enteredPassword = this.loginForm.value.password;

      this.loginService.authenticateUser(enteredUsername, enteredPassword).subscribe(
        (authenticated: boolean) => {
          if (authenticated) {
            console.log('Login successful');
            this.router.navigate(['/appointment-list']);
          } else {
            console.error('Invalid username or password');
          }
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    } else {
      console.error('Invalid form database');
    }
  }
}