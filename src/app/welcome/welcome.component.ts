import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { SessionTimeoutService } from '../session-timeout.service';
import { JwtResponse } from '@app/jwt-response';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  loginForm!: FormGroup;
  username: string = '';
  password: string = '';
  credentialError!: string;
  rememberMe: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private sessionTimeoutService: SessionTimeoutService
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
    const rememberedUsername = localStorage.getItem('username');
    if (rememberedUsername) {
      this.rememberMe = true;
      this.password = 'password';
      this.username = rememberedUsername;
      this.loginForm.patchValue({ username: rememberedUsername,password:this.password});
    }
  }

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: [this.username, [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]],
      password: [this.password, Validators.required],
      rememberMe: [this.rememberMe]
    });
  }

  login(): void {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    if (this.loginForm.valid) {
      this.loginService.authenticateUser(username, password).subscribe(
        (response: JwtResponse) => {
          if (this.rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('token', response.token);
          } else {
            localStorage.removeItem('username');
            localStorage.removeItem('token');
          }
          console.log('Login successful');
          this.router.navigate(['/appointment-list']);
        },
        (error) => {
          console.error('Invalid username or password', error);
          this.credentialError = 'Wrong username or password';
        }
      );
    } else {
      console.error('Invalid form database');
      this.credentialError = 'Empty or invalid credentials';
    }

    if (!this.rememberMe) {
      this.clearFormFields();
    }
  }

  private clearFormFields(): void {
    this.loginForm.patchValue({
      username: '',
      password: ''
    });
  }

  onRememberMeChange(): void {
    this.rememberMe = this.loginForm.get('rememberMe')?.value;
    if (!this.rememberMe) {
      localStorage.removeItem('username');
    }
  }
}
