import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SessionTimeoutService } from '../session-timeout.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.css'],

})
export class SessionTimeoutComponent implements OnInit  {
  public onContinue$: Subject<void> = new Subject<void>();
  public onLogout$: Subject<void> = new Subject<void>();

  constructor(public bsModalRef: BsModalRef, private SessionTimeoutService: SessionTimeoutService, private modalService:BsModalService,private router: Router) {}

 
  
  ngOnInit(): void {
    this.SessionTimeoutService.startSessionCheck();

  }
  onContinue(): void {
    console.log('OK button clicked in the modal.');
    this.onContinue$.next();
  }

  onClose(): void {
    this.router.navigate(['/login']);

    console.log('Modal closed without interaction.');
  }
}
