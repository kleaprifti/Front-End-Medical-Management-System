import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { SecondComponent } from './second/second.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DatePipe } from '@angular/common'; 
import { DateFormatPipe } from './date-format.pipe';






@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    SecondComponent,
    DateFormatPipe,
    CalendarComponent,
  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
