import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DatePipe } from '@angular/common'; 
import { DateFormatPipe } from './date-format.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalComponent } from './confirmation-modal/confirmation-modal.component';
import { AddAppointmentModalComponent } from './add-appointment-modal/add-appointment-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth.guard';
import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';







@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    AppointmentListComponent,
    DateFormatPipe,
    CalendarComponent,
    ModalComponent,
    AddAppointmentModalComponent,
    NotFoundComponent,
    SessionTimeoutComponent,
  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,

    BrowserAnimationsModule
  ],
  providers: [[AuthGuard]],
  bootstrap: [AppComponent]
})
export class AppModule { }
