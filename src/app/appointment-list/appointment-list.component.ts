import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { formatDate } from '@angular/common';
import { AddAppointmentModalComponent } from '../add-appointment-modal/add-appointment-modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  @ViewChild(AddAppointmentModalComponent, { static: false }) addAppointmentModal!: AddAppointmentModalComponent;
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
  appointmentForm: FormGroup | undefined = undefined;
  selectedDateTime!: string;
  bsModalRef: any;
  errorMessage: any;

  constructor(private userService: UserService,  private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,private modalService: BsModalService) {}

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

    this.loadAppointments();


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
      }  if (this.selectedDoctorId !== null || this.selectedPatientId !== null) {
      this.appointmentService.getAppointments(this.selectedDoctorId, this.selectedPatientId).subscribe(
          appointments => {
            this.appointments 
            = appointments.filter(a => {
                        const appointmentTime = new Date(a.appointmentDateStartTime).getTime();
                        return (!startDateTime || appointmentTime >= new Date(startDateTime).getTime()) &&
                               (!endDateTime || appointmentTime <= new Date(endDateTime).getTime());
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
  
  
  // openAddAppointmentModal() {
  //   const initialState = {
  //     selectedDoctorId: this.selectedDoctorId,
  //     selectedPatientId: this.selectedPatientId,
  //     selectedDate: this.selectedDate,
  //   };

  //   const modalRef: BsModalRef = this.modalService.show(AddAppointmentModalComponent, { initialState });
  //   modalRef.content.addAppointment.subscribe(() => {
  //     this.loadAppointments(); // Refresh the list of appointments when a new appointment is added
  //   });
  // }


  openAddAppointmentModal() {
    const initialState = {
      selectedDoctorName: this.selectedDoctorId,
      selectedPatientName: this.selectedPatientId,
    };
  
    this.bsModalRef = this.modalService.show(AddAppointmentModalComponent, {  });
  
    this.bsModalRef.content.result.subscribe((result: string) => {
      if (result === 'success') {
        this.loadAppointments();
      } else if (result === 'error') {
        this.errorMessage = this.bsModalRef.content.errorMessage;
      }
    });
  }
  // addAppointment() {
  //   const selectedDateTime: string = this.selectedDateTime;
  //   const formattedDateTime: string = formatDate(selectedDateTime, 'yyyy-MM-ddTHH:mm:ss', 'en-US');

  //   const appointmentDto = {
  //     doctorId: this.selectedDoctorId,
  //     patientId: this.selectedPatientId,
  //     appointmentDateStartTime: formattedDateTime,
  //     appointmentDateEndTime: formattedDateTime,
  //   };

  //   this.appointmentService.addAppointment(appointmentDto).subscribe(
  //     (response) => {
  //       this.showSuccessModal('Appointment added successfully');
  //       this.loadAppointments(); // Refresh the list of appointments
  //       this.modalService.hide(1); // Close the add appointment modal
  //     },
  //     (error) => {
  //       if (error.error.message === "It's not possible to add an appointment in the past") {
  //         this.showErrorModal("It's not possible to add an appointment in the past");
  //       } else if (error.error.message === 'The time slot is not available') {
  //         this.showErrorModal('The time slot is not available');
  //       } else {
  //         console.error('Error adding appointment:', error);
  //       }
  //     }
  //   );
  // }

  
  private showErrorModal(errorMessage: string) {
    const errorModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState: {
        modalTitle: 'Error',
        modalMessage: errorMessage
      }
    });
  }


  addAppointment() {
  
  
    const modalRef: BsModalRef = this.modalService.show(AddAppointmentModalComponent);
    
    modalRef.content.addAppointment.subscribe(() => {
      this.loadAppointments();
    });
  }
  // submitForm() {
  //   const currentDate = new Date();
  //   const selectedDate = new Date();

  //   if (selectedDate <= currentDate) {
  //     this.errorMessage = "It's not possible to add an appointment in the past";
  //     this.showErrorModal('error');
  //   } else {
  //     this.appointmentService.addAppointment(this.selectedDoctorId,this.patientId,selectedDate).subscribe(
  //       () => {
  //         this.showSuccessModal('Appointment added successfully');
  //         this.loadAppointments();
  //       },
  //       (error: { message: string }) => {
  //         if (error.message === "It's not possible to add an appointment in the past") {
  //           this.showErrorModal("It's not possible to add an appointment in the past");
  //         } else if (error.message === 'The time slot is not available') {
  //           this.showErrorModal('The time slot is not available');
  //         } else {
  //           console.error('Error adding appointment:', error);
  //         }
  //       }
  //     );
  //   }
  // }
  
}