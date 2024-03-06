// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { LoginService } from '../login.service';
// import { SessionTimeoutService } from '../session-timeout.service';


// @Component({
//   selector: 'app-welcome',
//   templateUrl: './welcome.component.html',
//   styleUrls: ['./welcome.component.css']
// })
// export class WelcomeComponent implements OnInit {
//   loginForm!: FormGroup;
//   username: string = 'romeisaaliu1@gmail.com';
//   password: string = 'password';
//   credentialError!: String;
//   rememberMe: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private loginService: LoginService,
//     private router: Router,
//     private sessionTimeoutService:SessionTimeoutService
//   ) {}

//   ngOnInit(): void {
//     this.createLoginForm();
//   }

//   private createLoginForm(): void {
//     this.loginForm = this.fb.group({
//       username: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]],
//       password: ['', Validators.required],
//       rememberMe: [false]
//     });
//   }

//   login(): void {
//     if (this.loginForm.valid) {
//       const { username, password, rememberMe } = this.loginForm.value;

//       this.loginService.authenticateUser(username, password).subscribe(
//         (response: any) => {
//           const { token } = response;
//           if (rememberMe) {
//             localStorage.setItem('username', username);
//             localStorage.setItem('token', token);
//           } else {
//             sessionStorage.setItem('token', token);
//           }
//           console.log('Login successful');
//           this.router.navigate(['/appointment-list']);
//         },
//         (error) => {
//           console.error('Invalid username or password', error);
//           this.credentialError = 'Wrong username or password';
//         }
//       );
//     } else {
//       console.error('Invalid form database');
//       this.credentialError = 'Empty or invalid credentials';
//     }
//   }

  
// }
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
      this.username = rememberedUsername;
      this.rememberMe = true;
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
    if (this.loginForm.valid) {
      const { username, password, rememberMe } = this.loginForm.value;

      this.loginService.authenticateUser(username, password).subscribe(
        (response: any) => {
          const { token } = response;
          if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('token', token);
          } else {
            sessionStorage.setItem('token', token);
            localStorage.removeItem('username'); // Remove remembered username if not checked
            localStorage.removeItem('token'); // Remove remembered token if not checked
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
  }
}