import { Component, Output, EventEmitter,Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LogoutService } from '@app/logout.service';
import { Route, Router } from '@angular/router';

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

  constructor(public bsModalRef: BsModalRef, private LogoutService: LogoutService,private router: Router) {}


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
  // confirmLogout() {
  //   this.LogoutService.logout().subscribe(() => {
  //     this.router.navigate(['/']);
  //     this.bsModalRef.hide();
  //   });
  // }
  
}

