import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AppointmentService } from '@app/appointment.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  doctorId: any;
  patientId: any;
  selectedDate: any;

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService // Inject your appointment service
  ) {}

  onSubmit(form: NgForm): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        this.errorMessage = ''; // Clear any previous error messages

        this.appointmentService.getAppointments(this.doctorId , this.patientId, this.selectedDate).subscribe(
          appointments => {
            console.log('Appointments retrieved successfully', appointments);
            // Handle the list of appointments as needed, e.g., store in a variable or display
          },
          appointmentError => {
            console.error('Failed to retrieve appointments', appointmentError);
            // Handle error while retrieving appointments
          }
        );

        // Handle successful login, e.g., redirect to another page
      },
      error => {
        console.error('Login failed', error);
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please check your credentials.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    );
  }
}