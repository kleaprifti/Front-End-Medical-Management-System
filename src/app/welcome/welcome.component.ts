import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})


export class WelcomeComponent {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const enteredUsername = this.loginForm.get('username')?.value || '';
      const enteredPassword = this.loginForm.get('password')?.value || '';

      this.authService.login(enteredUsername, enteredPassword).subscribe(
        (response) => {
          console.log('Login successful', response);
          this.router.navigate(['../appointments.service']);
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }
}