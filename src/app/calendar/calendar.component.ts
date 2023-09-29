import { Component  ,EventEmitter, Output,Input} from '@angular/core';
import { DateFormatPipe } from '../date-format.pipe'; // Import the custom pipe
import { Appointment } from '../appointment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  @Input() selectedDate: Date | null = new Date();

  @Output() selectedDateChange = new EventEmitter<Date | null>();
  @Input() appointments: Appointment[] = [];
  


  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selectedDate = target.value ? new Date(target.value) : null;
    this.selectedDate = selectedDate;
    this.selectedDateChange.emit(this.selectedDate);
  }
  

}