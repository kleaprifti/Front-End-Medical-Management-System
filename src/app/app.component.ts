import { Component } from '@angular/core';
// import { environment } from '@environments/dev-environment/environment.development';'@environments/prod-environment/environment.prod';
import { environment } from '@environments/prod-environment/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  template: '<p>API URL: {{ apiUrl }}</p>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'first-angular-project';
  apiUrl = environment.apiUrl;

}
