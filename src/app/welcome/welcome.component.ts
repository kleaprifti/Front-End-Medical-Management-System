import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})


export class WelcomeComponent {
  loginForm: FormGroup;
  username: string = 'kleaprifti21@gmail.com';
  password: string = 'password';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required,Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const enteredUsername = this.loginForm.get('username')?.value || '';
      const enteredPassword = this.loginForm.get('password')?.value || '';

      if (enteredUsername === this.username && enteredPassword === this.password) {
        this.router.navigateByUrl('/appointment-list');
      } else {
        this.loginForm.setErrors({ 'invalidLogin': true });
      }
    }
  }
}