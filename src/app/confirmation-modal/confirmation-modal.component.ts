import { Component, Output, EventEmitter,Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './confirmation-modal.component.html'
})
export class ModalComponent {
  @Output() confirmed = new EventEmitter<void>();
  @Input() actionType: 'confirmation' | 'success' | undefined;
  @Input() modalTitle: string | undefined;
  @Input() modalMessage: string | undefined;

  currentAppointment: { appointmentDateStartTime: string } | undefined;

  constructor(public bsModalRef: BsModalRef) {}


  confirm() {
    if (this.actionType === 'confirmation') {
      this.confirmed.emit();
    }
    this.bsModalRef.hide();
  }
  
  cancel() {
    this.bsModalRef.hide();
  }
  get showYesButton(): boolean {
    return this.actionType === 'confirmation';
  }
  
}

