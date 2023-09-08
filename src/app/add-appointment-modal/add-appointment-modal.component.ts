import { Component } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../appointment.service';
import { ModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { AppointmentListComponent } from '../appointment-list/appointment-list.component';

@Component({
  selector: 'app-add-appointment-modal',
  templateUrl: './add-appointment-modal.component.html',
  styleUrls: ['./add-appointment-modal.component.css']
})
export class AddAppointmentModalComponent {
  appointmentForm: FormGroup;

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private modalService: BsModalService
  ) {
    this.appointmentForm = this.formBuilder.group({
      dateTime: ['', Validators.required],
    });
  }

  
  confirm() {
    if (this.appointmentForm.valid) {

      const appointmentDto = {
        doctorId: Number,
        patientId: Number,
      };

      this.appointmentService.addAppointment(appointmentDto).subscribe(
        (response) => {
          this.showSuccessModal('Appointment added successfully');
          this.bsModalRef.hide(); 
        },
        (error) => {
          if (error.error.message === "It's not possible to add an appointment in the past") {
            this.showErrorModal("It's not possible to add an appointment in the past");
          } else if (error.error.message === 'The time slot is not available') {
            this.showErrorModal('The time slot is not available');
          } else {
            console.error('Error adding appointment:', error);
          }
        }
      );
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }

  private showSuccessModal(message: string) {
    const successModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState: {
        actionType: 'success',
        modalTitle: 'Success',
        modalMessage: message
      }
    });

    successModalRef.content.confirmed.subscribe(() => {
      this.bsModalRef.hide(); 
    });
  }

  private showErrorModal(errorMessage: string) {
    const errorModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState: {
        modalTitle: 'Error',
        modalMessage: errorMessage
      }
    });

    errorModalRef.content.confirmed.subscribe(() => {
      this.bsModalRef.hide(); 
    });
  }
}