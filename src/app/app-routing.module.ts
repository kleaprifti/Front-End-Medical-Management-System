import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth.guard';
import { BrowserModule } from '@angular/platform-browser';



const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'appointment-list', component: AppointmentListComponent ,canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent },
  { path: 'appointment-list', redirectTo: '', pathMatch: 'full' },

  

];

@NgModule({
  imports: [BrowserModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
