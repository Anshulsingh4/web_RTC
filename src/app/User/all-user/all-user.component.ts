import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.css']
})
export class AllUserComponent implements OnInit {

  constructor() { }
  chatBtn: string = "btn-primary";
  usersBtn: boolean = false;
  usersDetail: boolean = false;

  allUser = [
    { name: 'Anshul Singh', email: 'anshul@bigsteptech.com' },
    { name: 'Madhur Jain', email: 'madhur@bigsteptech.com' },
    { name: 'Mansi Gupta', email: 'mansi@bigsteptech.com' },
    { name: 'Rohan Kumawat', email: 'rohan@bigsteptech.com' },
    { name: 'Kailash Malveeya', email: 'kailash@bigsteptech.com' }
  ]

  ngOnInit(): void {
  }

  onUsers() {
    this.usersBtn = !this.usersBtn
    this.usersDetail = !this.usersDetail
  }

}
