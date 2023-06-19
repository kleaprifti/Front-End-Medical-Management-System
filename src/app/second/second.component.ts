import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css']
})
export class SecondComponent implements OnInit {
  
  doctors: User[] = [];
  sortedUsers: User[] = [];

    constructor(private userService: UserService) { }
  
    ngOnInit() {
      this.userService.getDoctors().subscribe(users => {
        this.doctors = users;
        this.sortUsersAlphabetically();
      });
    }
  
    sortUsersAlphabetically() {
      this.sortedUsers = this.doctors.sort((a, b) => {
        return a.fullName.localeCompare(b.fullName);
      });
    }
  }