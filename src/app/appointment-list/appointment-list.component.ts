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

  
    onDoctorPatientSelection(){
      console.log('Selected doctor ID and patient Id:' ,this.selectedDoctorId,this.selectedPatientId)
      this.isPatientSelected = !!this.selectedPatientId;
      this.isDoctorSelected = !!this.selectedDoctorId;
      this.searchAppointments();
    }
  
  loadDoctorAppointments() {
    console.log('Loading appointments...');
    if (this.selectedDoctorId !== null ) {
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
          this.appointments = appointments;
          this.sortAppointmentsByPatient();
          this.appointments.sort((a, b) => {
            const startTimeA = new Date(a.appointmentDateStartTime).getTime();
            const startTimeB = new Date(b.appointmentDateStartTime).getTime();
            return startTimeA - startTimeB;
          });
          console.log(this.appointments);
        },
        
        error => {
          console.log('Error occurred while loading appointments:', error);
          this.appointments = []; 
        }
      );
      this.appointments.sort((a, b) => {
        const startTimeA = new Date(a.appointmentDateStartTime).getTime();
        const startTimeB = new Date(b.appointmentDateStartTime).getTime();
        return startTimeB - startTimeA;
      });
    }  else if (this.selectedPatientId !== null) {
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
        patientAppointments => {
          this.patientAppointments = patientAppointments;
          this.sortAppointmentsByDoctor();
          this.patientAppointments.sort((a, b) => {
            const startTimeA = new Date(a.appointmentDateStartTime).getTime();
            const startTimeB = new Date(b.appointmentDateStartTime).getTime();
            return startTimeA - startTimeB;
          });
          console.log(this.patientAppointments);
        },
        error => {
          console.log('Error occurred while loading appointments:', error);
          this.patientAppointments = []; 
        }
      );
      
    } else {
      this.appointments = [];
      this.patientAppointments = [];
    }
  }


  loadPatientAppointments() {
    console.log('Loading appointments...');
    if (this.selectedPatientId !== null ) {
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
      this.appointmentService.getAppointments(this.selectedPatientId, startDateTime, endDateTime).subscribe(
        appointments => {
          this.appointments = appointments;
          this.sortAppointmentsByPatient();
          this.appointments.sort((a, b) => {
            const startTimeA = new Date(a.appointmentDateStartTime).getTime();
            const startTimeB = new Date(b.appointmentDateStartTime).getTime();
            return startTimeA - startTimeB;
          });
          console.log(this.appointments);
        },
        
        error => {
          console.log('Error occurred while loading appointments:', error);
          this.appointments = []; 
        }
      );
      this.appointments.sort((a, b) => {
        const startTimeA = new Date(a.appointmentDateStartTime).getTime();
        const startTimeB = new Date(b.appointmentDateStartTime).getTime();
        return startTimeB - startTimeA;
      });
    }  else if (this.selectedDoctorId !== null) {
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
      this.appointmentService.getMergedAppointments(this.selectedDoctorId ,startDateTime, endDateTime, this.selectedPatientId).subscribe(
        mergedAppointments => {
          this.mergedAppointments = mergedAppointments;
          this.sortAppointmentsByDoctor();
          this.sortAppointmentsByPatient();
          this.mergedAppointments.sort((a, b) => {
            const startTimeA = new Date(a.appointmentDateStartTime).getTime();
            const startTimeB = new Date(b.appointmentDateStartTime).getTime();
            return startTimeA - startTimeB;
          });
          console.log(this.mergedAppointments);
        },
        error => {
          console.log('Error occurred while loading appointments:', error);
          this.mergedAppointments = []; 
        }
      );
      
    } else {
      this.appointments = [];
      this.patientAppointments = [];
    }
  }

  onPatientSelectionChange(): void {
    if (this.selectedPatientId) {
      this.appointmentService.getAppointmentsForPatient(this.selectedPatientId)
        .subscribe(patientAppointments => {
          this.patientAppointments = patientAppointments;
        });
      }
    }

    searchAppointments() {
      if (this.selectedDoctorId && this.selectedPatientId) {
        this.appointmentService.getDoctorAndPatientAppointments(
          this.selectedDoctorId,
          this.selectedPatientId
        ).subscribe(
          appointments => {
            this.mergedAppointments = appointments;
            this.sortMergedAppointments(); // Sort the merged appointments
            console.log('Matching appointments:', this.mergedAppointments);
          },
          error => {
            console.log('Error occurred while fetching merged appointments:', error);
            this.mergedAppointments = []; 
          }
        );
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