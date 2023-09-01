import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../confirmation-modal/confirmation-modal.component';


@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  doctors: User[] = [];
  appointments: Appointment[] = [];
  patientAppointments: Appointment[] = [];
  mergedAppointments: Appointment[]= [];
  selectedDoctorId: number | null = null;
  isPatientSortedAscending: boolean = true;
  isDoctorSortedAscending: boolean = true;
  isDateSortedAscending: boolean = false;
  doctorSortOrder: 'asc' | 'desc' = 'asc';
  patientSortOrder: 'asc' | 'desc' = 'asc';
  startTimeSortOrder: 'asc' | 'desc' = 'asc';
  isDoctorSelected: boolean = false;
  isPatientSelected: boolean= false;
  selectedDate: Date | null = new Date();
  DeleteAppointment: Appointment[] = [];
  selectedPatientId: number | null = null;
  patients: User[] = [];
  selectedPatientAppointments: any[] = [];

  
  constructor(private userService: UserService, private appointmentService: AppointmentService,private modalService: BsModalService) {}

  ngOnInit() {
    this.userService.getDoctors().subscribe(users => {
      this.doctors = users;
      console.log('Doctors:', this.doctors);
    });
    this.userService.getPatients().subscribe(patients => {
      this.patients = patients;
      console.log('Patients:', this.patients);
    });
    this.loadDoctorAppointments();
    this.loadPatientAppointments();

  }

  isFutureDate(dateStr: string): boolean {
    const currentDate = new Date().getTime();
    const appointmentDate = new Date(dateStr).getTime();
    return appointmentDate > currentDate;
  
}


onDeleteAppointment(appointment: Appointment) {
  const confirmationModalRef: BsModalRef = this.modalService.show(ModalComponent, {
    initialState: {
      actionType: 'confirmation',
      modalTitle: 'Confirmation',
      modalMessage: 'Are you sure you want to delete this appointment?'
    }
  });

  confirmationModalRef.content.confirmed.subscribe(() => {
    this.appointmentService.deleteAppointment(appointment.appointmentId, false).subscribe(
      () => {
        this.appointments = this.appointments.filter(a => a !== appointment);
        this.showSuccessModal('Appointment deleted successfully');
      },
      error => {
        console.log('Error occurred while deleting appointment:', error);
      }
    );
  });
}

showSuccessModal(message: string) {
  const successModalRef: BsModalRef = this.modalService.show(ModalComponent, {
    initialState: {
      actionType: 'success',
      modalTitle: 'Success',
      modalMessage: message
    }
  });

  successModalRef.content.confirmed.subscribe(() => {
  });
}

  onDoctorSelection() {
    console.log('Selected doctor ID:', this.selectedDoctorId);
    this.isDoctorSelected = !!this.selectedDoctorId;
    this.loadDoctorAppointments();

  }

  onPatientSelection() {
        console.log('Selected patient ID:', this.selectedPatientId);
        this.isPatientSelected = !!this.selectedPatientId;
        this.loadPatientAppointments();
    }
    
  loadDoctorAppointments() {
    console.log('Loading appointments...');
    if (this.selectedDoctorId !== null) {
      let startDateTime: string | undefined;
      let endDateTime: string | undefined;
      if (this.selectedDate) {
        const start = new Date(this.selectedDate);
        start.setHours(0, 0, 0, 0);
        startDateTime = start.toISOString();
        const end = new Date(this.selectedDate);
        end.setHours(23, 59, 59, 999);
        endDateTime = end.toISOString();
      }
  
      this.appointmentService.getAppointments(this.selectedDoctorId, startDateTime, endDateTime).subscribe(
        appointments => {
          this.appointments = appointments.filter(a => {
            const appointmentTime = new Date(a.appointmentDateStartTime).getTime();
            return (!startDateTime || appointmentTime >= new Date(startDateTime).getTime()) &&
                   (!endDateTime || appointmentTime <= new Date(endDateTime).getTime());
          });
  
          if (this.selectedPatientId !== null) {
            this.appointments = this.appointments.filter(a => a.patientId === this.selectedPatientId);
          }
  
          console.log('**************');
          console.log(this.appointments);
  
          this.sortAppointmentsByTime();
        },
  
        error => {
          console.log('Error occurred while loading appointments:', error);
          this.appointments = [];
        }
      );
    } else {
      this.appointments = [];
      this.patientAppointments = [];
    }
  }
  
  loadPatientAppointments() {
    console.log('Loading appointments...');
    if (this.selectedPatientId !== null) {
      let startDateTime: string | undefined;
      let endDateTime: string | undefined;
      if (this.selectedDate) {
        const start = new Date(this.selectedDate);
        start.setHours(0, 0, 0, 0);
        startDateTime = start.toISOString();
        const end = new Date(this.selectedDate);
        end.setHours(23, 59, 59, 999);
        endDateTime = end.toISOString();
      }
  
      this.appointmentService.getAppointmentsForPatient(this.selectedPatientId).subscribe(
        appointments => {
          this.appointments = appointments.filter(a => {
            const appointmentTime = new Date(a.appointmentDateStartTime).getTime();
            return (!startDateTime || appointmentTime >= new Date(startDateTime).getTime()) &&
                   (!endDateTime || appointmentTime <= new Date(endDateTime).getTime());
          });
          
          if (this.selectedDoctorId !== null) {
            this.appointments = this.appointments.filter(a => a.doctorId === this.selectedDoctorId);
          }
  
          console.log('**************');
          console.log(this.appointments);
          
          this.sortAppointmentsByTime();
        },
        
        error => {
          console.log('Error occurred while loading appointments:', error);
          this.appointments = []; 
        }
      );
    } else {
      this.appointments = [];
      this.patientAppointments = [];
    }
  }
  
  sortAppointmentsByTime() {
    this.appointments.sort((a, b) => {
      const startTimeA = new Date(a.appointmentDateStartTime).getTime();
      const startTimeB = new Date(b.appointmentDateStartTime).getTime();
      return startTimeA - startTimeB;
    });
  }
    

  onPatientSelectionChange(): void {
    if (this.selectedPatientId) {
      this.appointmentService.getAppointmentsForPatient(this.selectedPatientId)
        .subscribe(patientAppointments => {
          this.patientAppointments = patientAppointments;
        });
      }
    }

    
  onDateSelection(selectedDate: Date | null) {
    this.selectedDate = selectedDate;
    this.loadDoctorAppointments();
    this.loadPatientAppointments();

  }
  
 
  clearDate() {
    this.selectedDate = null; 
    this.loadDoctorAppointments();
    this.loadPatientAppointments();
    }

  sortMergedAppointments() {
    this.mergedAppointments.sort((a, b) => {

      const doctorNameA = a.doctorFullName.toLowerCase();
      const doctorNameB = b.doctorFullName.toLowerCase();
      const doctorComparison = doctorNameA.localeCompare(doctorNameB);
  
      if (doctorComparison !== 0) {
        return doctorComparison;
      }
  
      const patientNameA = a.patientFullName.toLowerCase();
      const patientNameB = b.patientFullName.toLowerCase();
      const patientComparison = patientNameA.localeCompare(patientNameB);
  
      if (patientComparison !== 0) {
        return patientComparison;
      }
  
      const startTimeA = new Date(a.appointmentDateStartTime).getTime();
      const startTimeB = new Date(b.appointmentDateStartTime).getTime();
  
      return this.startTimeSortOrder === 'asc' ? startTimeA - startTimeB : startTimeB - startTimeA;
    });
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

  sortAppointmentsByDoctor() {
    this.isDoctorSortedAscending = !this.isDoctorSortedAscending;
    this.appointments.sort((a, b) => {
      const nameA = a.doctorFullName.toLowerCase();
      const nameB = b.doctorFullName.toLowerCase();

      if (this.isDoctorSortedAscending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  togglePatientSortOrder() {
    this.patientSortOrder = this.patientSortOrder === 'asc' ? 'desc' : 'asc';
    this.sortAppointmentsByPatient();
  }
  
  toggleDoctorSortOrder() {
    this.doctorSortOrder = this.doctorSortOrder === 'asc' ? 'desc' : 'asc';
    this.sortAppointmentsByDoctor();
  }

  sortAppointmentsByStartTime() {
    this.appointments.sort((a, b) => {
      const startTimeA = new Date(a.appointmentDateStartTime).getTime();
      const startTimeB = new Date(b.appointmentDateStartTime).getTime();

      return this.startTimeSortOrder === 'asc' ? startTimeA - startTimeB : startTimeB - startTimeA;
    });
  }

  toggleStartTimeSortOrder() {
    this.startTimeSortOrder = this.startTimeSortOrder === 'asc' ? 'desc' : 'asc';
    this.sortAppointmentsByStartTime();
  }

}