import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
