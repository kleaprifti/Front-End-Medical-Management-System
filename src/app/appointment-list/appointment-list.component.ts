import { Component, NgModule, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { formatDate } from '@angular/common';
import { AddAppointmentModalComponent } from '../add-appointment-modal/add-appointment-modal.component';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import {  ViewChild,AfterViewInit,  ElementRef } from '@angular/core';
import { SessionTimeoutService } from '../session-timeout.service';
import { LoginService } from '../login.service';
import { LogoutService } from '../logout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  @ViewChild(AddAppointmentModalComponent, { static: false }) addAppointmentModal!: AddAppointmentModalComponent;
  @ViewChild('modalForm')
  modalForm!: NgForm; 
  modalFormGroup!: FormGroup;
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
  isAddButtonEnabled: boolean = false;
  doctorId: number | null = null;
  patientId: number | null = null;
  startDateTime: string | undefined = undefined;
  endDateTime: string | undefined = undefined;
  appointmentForm!: FormGroup;
  selectedDateTime!: string;
  bsModalRef!: ModalComponent;
  errorMessage: any;
  startTimeToCheck!: string;
  latestAddedAppointmentDateTime: Date | null = null;
  loginService: any;
  SessionTimeoutService: any;




  constructor(private userService: UserService, private LogoutService:LogoutService, private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,private modalService: BsModalService,private router: Router) {}
   
  
  ngOnInit() {
    this.userService.getDoctors().subscribe(users => {
      this.doctors = users;
      console.log('Doctors:', this.doctors);
    });
    this.userService.getPatients().subscribe(patients => {
      this.patients = patients;
      console.log('Patients:', this.patients);
    });
    this.formBuilder.group({
      dateTime: ['', Validators.required], 
    });
    this.LogoutService.getLogoutObservable().subscribe(() => {
      console.log('Logout successful');
    });
    this.LogoutService.logout();
    this.loadAppointments();
    this.appointmentService.getAllAppointments(this.doctorId,this.patientId,this.startDateTime,this.endDateTime).subscribe(
      (data) => {
        this.appointments = data;
      },
      (error) => {
        console.error('Error fetching appointments', error);
      }
    );

  }
  @NgModule({
    declarations: [
      AddAppointmentModalComponent,
    ],
  })


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

isDuplicateStartTime(): boolean {
  return this.appointments.some(appointment => appointment.appointmentDateStartTime === this.startTimeToCheck);
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
    this.loadAppointments();
  });
}



  onDoctorSelection() {
    console.log('Selected doctor ID:', this.selectedDoctorId);
    this.isDoctorSelected = !!this.selectedDoctorId;
    this.updateAddButtonState();
    this.loadAppointments();

  }

  onPatientSelection() {
        console.log('Selected patient ID:', this.selectedPatientId);
        this.isPatientSelected = !!this.selectedPatientId;
        this.loadAppointments();
        this.updateAddButtonState();

    }
    
updateAddButtonState() {
  this.isAddButtonEnabled = this.selectedDoctorId !== null && this.selectedPatientId !== null;
}

    
  loadAppointments(): void {
      console.log('Loading appointments...');
      if (this.selectedDoctorId !== null || this.selectedPatientId !== null) {
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
       if (this.selectedDoctorId !== null || this.selectedPatientId !== null) {
      this.appointmentService.getAppointments(this.selectedDoctorId, this.selectedPatientId).subscribe(
          appointments => {
            this.appointments = appointments.filter(a => {
              const appointmentTime = new Date(a.appointmentDateStartTime).getTime();
              return (!startDateTime || appointmentTime >= new Date(startDateTime).getTime()) &&
                   (!endDateTime || appointmentTime <= new Date(endDateTime).getTime());
              const appointmentDate = new Date(a.appointmentDateStartTime);
              return appointmentDate.toDateString() === this.selectedDate?.toDateString()
              
            });      
                    }, (error) => {
            console.error('Error fetching appointments:', error);
          }
        );
    } else {
      this.appointments = [];
    }
  }

}


logout(): void {

  const confirmationModalRef: BsModalRef = this.modalService.show(ModalComponent, {
    initialState: {
      actionType: 'confirmation',
      modalTitle: 'Logout Confirmation',
      modalMessage: 'Are you sure you want to logout?'
    }

});  
confirmationModalRef.content.confirmed.subscribe(() => {
  this.LogoutService.logout();
    this.router.navigate(['/']);
  
});
}


  sortAppointmentsByTime() {
    this.appointments.sort((a, b) => {
      const startTimeA = new Date(a.appointmentDateStartTime).getTime();
      const startTimeB = new Date(b.appointmentDateStartTime).getTime();
      return startTimeA - startTimeB;
    });
  }
    

  onDoctorSelectionChange(): void {
    if (this.selectedDoctorId) {
      this.appointmentService.getAppointments(this.selectedDoctorId,null)
        .subscribe(appointments => {
          this.appointments = this.appointments;
        });
      }
    }
    
  onPatientSelectionChange(): void {
    if (this.selectedPatientId) {
      this.appointmentService.getAppointments(null,this.selectedPatientId)
        .subscribe(patientAppointments => {
          this.patientAppointments = patientAppointments;
        });
      }
    }

    
 
  onDateSelection(selectedDate: Date | null) {
    this.selectedDate = selectedDate;
    this.loadAppointments();

  }
  clearDate() {
    this.selectedDate = null; 
    this.loadAppointments();
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
  
 

  openAddAppointmentModal() {
    const initialState = {
      selectedDoctorId: this.selectedDoctorId,
      selectedPatientId: this.selectedPatientId,
    };
  
    const modalRef: BsModalRef = this.modalService.show(AddAppointmentModalComponent, {
      initialState,
    });
  
    modalRef.content.result.subscribe((result: string) => {
      
      if (result === 'success') {
        this.loadAppointments();
      } else if (result === 'error') {
        this.errorMessage = modalRef.content.errorMessage;
      }
    });
    modalRef.content.appointmentAdded.subscribe((response: Appointment) => {
      this.onAppointmentAdded(response);
      this.loadAppointments();

    });
   
  }
  
  onAppointmentAdded(response: Appointment) {
    this.appointments.push(response);

    this.selectedDate = new Date(response.appointmentDateStartTime);
    this.sortAppointmentsByStartTime();
  
  }

}