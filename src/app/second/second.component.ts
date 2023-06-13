import { Component } from '@angular/core';
import { DoctorService } from '../doctor.service';

interface Doctor{
  fullName: string;
}

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css']
})
export class SecondComponent {
  doctors: Doctor[];


  constructor(private doctorService: DoctorService){
    this.doctors = [];
  }

  onDoctorSelect(selectedDoctor: string): void{
    if(selectedDoctor!=='empty'){
      this.doctorService.getDoctors()
      .subscribe(
        doctors => {
          console.log(doctors);
        },
        error =>{
        console.error(error);
        }
      );
    }
  }
}
