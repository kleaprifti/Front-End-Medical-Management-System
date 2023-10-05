import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Appointment } from './appointment';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;
  constructor(private http: HttpClient) { }
  getAppointments(doctorId: number | null, patientId: number | null, selectedDate?: Date): Observable<Appointment[]> {
    let params = new HttpParams();

    if (doctorId !== null) {
      params = params.append('doctorId', doctorId.toString());
    }

    if (patientId !== null) {
      params = params.append('patientId', patientId.toString());
    }

    if (selectedDate) {
      params = params.append('selectedDate', selectedDate.toISOString());
    }

    return this.http.get<Appointment[]>(`${this.apiUrl}`, { params });
  }
  
getAllAppointments(doctorId: number | null, patientId: number | null,startDateTime: string | undefined, endDateTime: string | undefined): Observable<Appointment[]> {
    let params = new HttpParams();

    if (doctorId !== null) {
      params = params.append('doctorId', doctorId.toString());
    }
    if (patientId !== null) {
      params = params.append('doctorId', patientId.toString());
    }

    if (startDateTime !== undefined && endDateTime !== undefined) {
      params = params.append('startDateTime', startDateTime);
      params = params.append('endDateTime', endDateTime);
    }

    const url = `${this.apiUrl}`;
    return this.http.get<Appointment[]>(url, { params: params });
  }
  
  deleteAppointment(appointmentId: number, wantNotification: boolean): Observable<void> {
    const url = `${this.apiUrl}/${appointmentId}?wantNotification=${wantNotification}`;
    return this.http.delete<void>(url);
}


addAppointment(appointment: {
  doctorId: number | null,
  patientId: number | null,
  startDateTime: DatePipe, 
  endDateTime: DatePipe, 
}): Observable<Appointment> {
  const startDateTime = appointment.startDateTime;
  const endDateTime = appointment.endDateTime;

  const body = {
    doctorId: appointment.doctorId,
    patientId: appointment.patientId,
    appointmentDateStartTime: startDateTime,
    appointmentDateEndTime: endDateTime,
  };

  return this.http.post<Appointment>(`${this.apiUrl}/add`, body).pipe(
    catchError((error) => {
      console.error('Error adding appointment:', error);
      throw error;
    })
  );
}

  }