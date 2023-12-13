// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { LoginService } from '../login.service';

// @Component({
//   selector: 'app-welcome',
//   templateUrl: './welcome.component.html',
//   styleUrls: ['./welcome.component.css']
// })
// export class WelcomeComponent {
//   loginForm!: FormGroup;
//   username: string = 'romeisaaliu1@gmail.com';
//   password: string = 'password';
//   constructor(
//     private fb: FormBuilder,
//     private loginService: LoginService,
//     private router: Router
//   ) {
//     this.createLoginForm();
//   }

//   private createLoginForm(): void {
//     this.loginForm = this.fb.group({
//       username: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]],
//       password: ['', Validators.required],
//     });
//   }
//   private checkSessionTimeout(): void {
//     setTimeout(() => {
//       this.loginService.logout();
//       this.router.navigateByUrl(''); 
//     }, this.loginService.getSession() ? this.loginService.getSession().timeout : 0);
//   }
//   login(): void {
//     if (this.loginForm.valid) {
//       const enteredUsername = this.loginForm.value.username;
//       const enteredPassword = this.loginForm.value.password;

//       this.loginService.authenticateUser(enteredUsername, enteredPassword).subscribe(
//         (authenticated: boolean) => {
//           if (authenticated) {
//             console.log('Login successful');
//             this.router.navigate(['/appointment-list']);
//           } else {
//             console.error('Invalid username or password');
//           }
//         },
//         (error) => {
//           console.error('Login failed', error);
//         }
//       );
//     } else {
//       console.error('Invalid form database');
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  loginForm!: FormGroup;
  username: string = 'romeisaaliu1@gmail.com';
  password: string = 'password';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
    this.checkSessionTimeout();
  }

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]],
      password: ['', Validators.required],
    });
  }

  private checkSessionTimeout(): void {
    const session = this.loginService.getSession();
    if (session) {
      setTimeout(() => {
        this.loginService.logout();
        this.router.navigateByUrl('/');
      }, session.timeout);
    }
  }

  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.loginService.authenticateUser(username, password).subscribe(
        () => {
          console.log('Login successful');
          this.router.navigate(['/appointment-list']);
        },
        (error) => {
          console.error('Invalid username or password', error);
        }
      );
    } else {
      console.error('Invalid form data');
    }
  }
}
