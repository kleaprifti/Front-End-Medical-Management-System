import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';



@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css']
})
export class SecondComponent implements OnInit {
  
  doctors: User[] = [];
  appointments: Appointment[] = [];
  selectedDoctorId: number | null = null;
  isPatientSortedAscending: boolean = true;
  isDateSortedAscending:boolean=false;

    constructor(private userService: UserService, private appointmentService: AppointmentService) { }
  
    ngOnInit() {
      this.userService.getDoctors().subscribe(users => {
        this.doctors = users;
        console.log('Doctors:', this.doctors);
      });
      this.loadAppointments();
    }
    
    onDoctorSelection() {
      console.log('Selected doctor ID:', this.selectedDoctorId);
      if (this.selectedDoctorId !== null) {
        this.loadAppointments();
      } 
    }
    loadAppointments() {
      console.log('Loading appointments...');
  
      if (this.selectedDoctorId !== null) {
        this.appointmentService.getAppointments(this.selectedDoctorId).subscribe(
          appointments => {
            this.appointments = appointments.sort((a, b) =>
              new Date(b.appointmentDateStartTime).getTime() - new Date(a.appointmentDateStartTime).getTime()
            );
            console.log(this.appointments);
          },
          error => {
            console.log('Error occurred while loading appointments:', error);
          }
        );
      }
    }
  
    sortAppointmentsByPatient() {
      this.isPatientSortedAscending = !this.isPatientSortedAscending;
      this.appointments.sort((a, b) => {
        const nameA = a.patientFullName.toLowerCase();
        const nameB = b.patientFullName.toLowerCase();
  
        if (this.isPatientSortedAscending) {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }

    sortAppointmentsByDate() {
      this.isDateSortedAscending = !this.isDateSortedAscending;
      this.appointments.sort((a, b) =>
        this.isDateSortedAscending
          ? new Date(a.appointmentDateStartTime).getTime() - new Date(b.appointmentDateStartTime).getTime()
          : new Date(b.appointmentDateStartTime).getTime() - new Date(a.appointmentDateStartTime).getTime()
      );
    }

}
  