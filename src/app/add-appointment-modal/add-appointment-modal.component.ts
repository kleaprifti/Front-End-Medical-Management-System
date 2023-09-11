import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../appointment.service'; // Assuming you have an AppointmentService
import { UserService } from '../user.service'; // Assuming you have a UserService

@Component({
  selector: 'app-add-appointment-modal',
  templateUrl: './add-appointment-modal.component.html',
  styleUrls: ['./add-appointment-modal.component.css']
})

export class AddAppointmentModalComponent {
  @Output() result: EventEmitter<string> = new EventEmitter<string>();
  errorMessage: string | undefined;
  appointmentDateTime!: string;
  appointments: any[] = [];
  actionType: string | undefined;
  appointmentForm: FormGroup;
  BsModalRef: any;
  appointmentService: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) {
    this.appointmentForm = this.formBuilder.group({
      appointmentDateTime: ['', Validators.required],
    });
  }

  // Rest of your code...


//     submitForm() {
//       const currentDate = new Date(); // Get the current date and time as a local date object
//       const selectedDate = new Date(this.appointmentDateTime); // Get the selected date and time as a local date object
  
//       if (selectedDate > currentDate) {
//         this.result.emit('success');
//       } else {
//         this.errorMessage = "It's not possible to add an appointment in the past";
//         this.result.emit('error');
//       }
//     }
  
//   cancel() {
//     this.result.emit('cancel');
//   }
// }
submitForm() {
  const currentDate = new Date(); 
  const selectedDate = new Date(this.appointmentDateTime); 

  if (selectedDate <= currentDate) {
    this.errorMessage = "It's not possible to add an appointment in the past";
    this.result.emit('error');
  } else {
   this.appointmentService.addAppointment(selectedDate).subscribe(
  () => {
    this.showSuccessModal('Appointment added successfully');
    this.loadAppointments();
  },
  (error: { message: string; }) => {
    if (error.message === "It's not possible to add an appointment in the past") {
      this.showErrorModal("It's not possible to add an appointment in the past");
    } else if (error.message === 'The time slot is not available') {
      this.showErrorModal('The time slot is not available');
    } else {
      console.error('Error adding appointment:', error);
    }
  }
);
  }
}
  showSuccessModal(message: string) {
    const successModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState: {
        actionType: 'success',
        modalTitle: 'Success',
        modalMessage: message,
      },
    });
  
    successModalRef.content.confirmed.subscribe(() => {
      // You can perform any actions here after the user confirms the modal
      this.loadAppointments(); // Refresh the appointment list if needed
    });
  }
  
  loadAppointments() {
    // Assuming you have an appointment service that fetches appointments
    this.appointmentService.getAppointments().subscribe(
      (appointments: any) => {
        this.appointments = appointments;
      },
      (error: any) => {
        console.error('Error loading appointments:', error);
      }
    );
  }
  
  showErrorModal(errorMessage: string) {
    const errorModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState: {
        modalTitle: 'Error',
        modalMessage: errorMessage,
      },
    });
  
    errorModalRef.content.confirmed.subscribe(() => {
    });
  }

  cancel() {
    this.BsModalRef.hide();
  }
    get showYesButton(): boolean {
      return this.actionType === 'confirmation';
    }
}