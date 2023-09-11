import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../appointment.service';
import { UserService } from '../user.service';

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
  modalRef!: BsModalRef;
  confirmed!: boolean;
  doctorId!: number | null;
  patientId!: number | null;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private appointmentService: AppointmentService,
    private userService: UserService 
  ) {
    this.appointmentForm = this.formBuilder.group({
      appointmentDateTime: ['', Validators.required],
    });
  }

  showConfirmationModal() {
    this.modalRef = this.modalService.show(ModalComponent, {
      initialState: {
        actionType: 'confirmation',
        modalTitle: 'Confirm',
        modalMessage: 'Are you sure you want to add this appointment?',
      },
    });

    this.modalRef.content.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.submitForm();
      }
    });
  }

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
        (error: { message: string }) => {
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
      this.loadAppointments();
    });
  }

  loadAppointments() {
    this.appointmentService.getAppointments(this.doctorId, this.patientId).subscribe(
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

    errorModalRef.content.confirmed.subscribe(() => {});
  }

  cancel() {
    this.modalRef.hide();
  }
}