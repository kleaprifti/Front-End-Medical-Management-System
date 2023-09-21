import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../appointment.service';
import { Appointment } from '../appointment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-add-appointment-modal',
  templateUrl: './add-appointment-modal.component.html',
  styleUrls: ['./add-appointment-modal.component.css']
})
export class AddAppointmentModalComponent implements OnInit {
  @Output() result: EventEmitter<string> = new EventEmitter<string>();
  @Input() selectedDoctorId: number | null = null;
  @Input() selectedPatientId: number | null = null;
  @Input() actionType: 'confirmation' | 'success' | undefined;
  @Input() modalTitle: string | undefined;
  @Input() modalMessage: string | undefined;
  
  errorMessage: string | undefined;
  appointments: Appointment[] = [];
  appointmentForm!: FormGroup;
  modalRef!: BsModalRef;
  confirmed!: boolean;
  selectedDate: Date | undefined;
  appointmentDateStartTime: Date = new Date(); 
  appointmentDateEndTime: Date = new Date();
  isErrorVisible: boolean = true;
  minDate: string = new Date().toISOString().slice(0, 16);
  selectedDateTime: Date = new Date(); 
  selectedStartDate:  Date = new Date();
  selectedEndDate:  Date = new Date();
  formValue: any;

  constructor(
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private appointmentService: AppointmentService,
    private formBuilder: FormBuilder

  ) { }

  ngOnInit() {
    console.log('Selected doctor ID:', this.selectedDoctorId);
    console.log('Selected patient ID:', this.selectedPatientId);
    this.appointmentForm = this.formBuilder.group({
      doctorId: [this.selectedDoctorId, Validators.required],
      patientId: [this.selectedPatientId, Validators.required],
      appointmentDateStartTime: [this.selectedStartDate, Validators.required],
      appointmentDateEndTime: [this.selectedEndDate, Validators.required],

    });
    
  }
  
  submitForm() {
      const formValue = this.appointmentForm.value;

      this.appointmentService.addAppointment({
        doctorId: formValue.doctorId,
        patientId: formValue.patientId,
        startDateTime: formValue.appointmentDateStartTime,
        endDateTime: formValue.appointmentDateEndTime
      }).subscribe(
        (response) => {
          console.log('Success ', response);
          this.errorMessage = undefined;
          this.showSuccessModal('Appointment added successfully.');

        },
        (error) => {
          console.log("error");
          console.error('Error adding appointment:', error);
          this.errorMessage = error.error.message;
        }
      );
 
  }

  showSuccessModal(message: string) {
 
    const successModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState: {
        actionType: 'success',
        modalTitle: 'Success',
        modalMessage: message,
      },
    });
  
    successModalRef.content.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {

      }
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
      console.log('Selected doctor ID:', this.selectedDoctorId);
      console.log('Selected patient ID:', this.selectedPatientId);

      console.log('Selected startTime',this.selectedStartDate);
      console.log('Selected End Date Time',this.selectedEndDate);
      console.log('Form is valid:', this.appointmentForm.valid);
      console.log('Form  value:', this.appointmentForm.value);

  this.submitForm();

    });
  }

  showErrorModal(errorMessage: string) {
    const errorModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState: {
        modalTitle: 'Error',
        modalMessage: errorMessage,
      },
    });
  
    errorModalRef.content.confirmed.subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log('Error modal confirmed');
      } else {
        console.log('Error modal canceled');
      }
    });
  }
  

  cancel() {
    this.bsModalRef.hide();
    this.modalRef.hide();
  }
}