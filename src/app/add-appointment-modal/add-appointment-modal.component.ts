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
  datepickerConfig: Partial<BsDatepickerConfig>;
  errorMessage: string | undefined;
  appointments: Appointment[] = [];
  appointmentForm!: FormGroup;
  modalRef!: BsModalRef;
  confirmed!: boolean;
  selectedDate: Date | undefined;
  appointmentDateStartTime!: string| undefined;
  appointmentDateEndTime!: string| undefined;
  isErrorVisible: boolean = true;

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private appointmentService: AppointmentService
  ) { this.datepickerConfig = Object.assign({}, {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'YYYY-MM-DD HH:mm', 
    showWeekNumbers: false,
  });}

  ngOnInit() {
    console.log('Selected doctor ID:', this.selectedDoctorId);
    console.log('Selected patient ID:', this.selectedPatientId);

    this.appointmentForm = this.formBuilder.group({
      doctorId: [this.selectedDoctorId, Validators.required],
      patientId: [this.selectedPatientId, Validators.required],
      appointmentDateStartTime: ['', Validators.required],
      appointmentDateEndTime: ['', Validators.required],

    });
  }
  
  
  submitForm() {
    const selectedDoctorId = this.selectedDoctorId;
    const selectedPatientId = this.selectedPatientId;
    const startDateTime = this.appointmentForm.get('appointmentDateStartTime')?.value;
    const endDateTime = this.appointmentForm.get('appointmentDateEndTime')?.value;
    const currentTime = new Date();
  
 
    if (selectedDoctorId !== null && selectedPatientId !== null && startDateTime <= currentTime) {
      this.errorMessage = "It's not possible to add an appointment in the past";
      this.isErrorVisible = true;
      this.result.emit('error');
    } else {
      this.appointmentService.addAppointment({
        doctorId: selectedDoctorId,
        patientId: selectedPatientId,
        startDateTime: startDateTime,
        endDateTime: endDateTime
      }).subscribe(
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
          (appointments) => {
            this.appointments = appointments.filter((a) => {
              const appointmentTime = new Date(a.appointmentDateStartTime).getTime();
              return (
                (!startDateTime || appointmentTime >= new Date(startDateTime).getTime()) &&
                (!endDateTime || appointmentTime <= new Date(endDateTime).getTime())
              );
            });
          },
          (error) => {
            console.error('Error fetching appointments:', error);
          }
        );
      } else {
        this.appointments = [];
      }
    }
  }

  showSuccessModal(message: string) {
    this.submitForm();
  
    const successModalRef: BsModalRef = this.modalService.show(ModalComponent, {
      initialState: {
        actionType: 'success',
        modalTitle: 'Success',
        modalMessage: message,
      },
    });
  
    successModalRef.content.confirmed.subscribe((confirmed: boolean) => {
      this.loadAppointments();
      if (confirmed) {
        this.submitForm();
      }
    });
  }

  showConfirmationModal() {
    this.loadAppointments();
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