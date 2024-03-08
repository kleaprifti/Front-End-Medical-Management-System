import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { SessionTimeoutService } from '../session-timeout.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  loginForm!: FormGroup;
  username: string = 'romeisaaliu1@gmail.com';
  password: string = 'password';
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
      this.username = rememberedUsername;
    }else{
      this.clearFormFields();

    }
  }
  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: [this.username, [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]],
      password: [this.password, Validators.required],
      rememberMe: [this.rememberMe]
    });
  }
  login(username:string,password:string): void {
    if (this.loginForm.valid) {
      // const { username, password, rememberMe } = this.loginForm.value;
      this.loginService.authenticateUser(username, password).subscribe(
        (response: any) => {
          if (this.rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
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

 }