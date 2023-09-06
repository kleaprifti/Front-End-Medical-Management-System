import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from './appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/appointments';
  constructor(private http: HttpClient) { }
  getAppointments(doctorId?: number, patientId?: number, selectedDate?: Date): Observable<Appointment[]> {
    let params = new HttpParams();

    if (doctorId !== undefined) {
      params = params.append('doctorId', doctorId.toString());
    }

    if (patientId !== undefined) {
      params = params.append('patientId', patientId.toString());
    }

    if (selectedDate) {
      params = params.append('selectedDate', selectedDate.toISOString());
    }

    return this.http.get<Appointment[]>(`${this.apiUrl}`, { params });
  }

  
  deleteAppointment(appointmentId: number, wantNotification: boolean): Observable<void> {
    const url = `${this.apiUrl}/${appointmentId}?wantNotification=${wantNotification}`;
    return this.http.delete<void>(url);
}

}