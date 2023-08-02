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


  getAppointments(doctorId: number, startDateTime?: string, endDateTime?: string): Observable<Appointment[]> {
    let url = `${this.apiUrl}/${doctorId}`;
  
    if (startDateTime && endDateTime) {
      url += `?startDateTime=${startDateTime}&endDateTime=${endDateTime}`;
    }
  
    return this.http.get<Appointment[]>(url);
  }
  
  getAllAppointments(doctorId: number | null, startDateTime: string | undefined, endDateTime: string | undefined): Observable<Appointment[]> {
    let params = new HttpParams();

    if (doctorId !== null) {
      params = params.append('doctorId', doctorId.toString());
    }

    if (startDateTime !== undefined && endDateTime !== undefined) {
      params = params.append('startDateTime', startDateTime);
      params = params.append('endDateTime', endDateTime);
    }

    const url = `${this.apiUrl}/appointments`;
    return this.http.get<Appointment[]>(url, { params: params });
  }
  
  deleteAppointment(appointmentId: number, wantNotification: boolean): Observable<void> {
    const url = `${this.apiUrl}/${appointmentId}?wantNotification=${wantNotification}`;
    return this.http.delete<void>(url);
}


}