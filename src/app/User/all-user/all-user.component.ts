import { Component, OnInit } from '@angular/core';
import { RemoteUserComponent } from 'src/app/remoteUser/remote-user/remote-user.component';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.css']
})
export class AllUserComponent implements OnInit {

  constructor(private remoteUser: RemoteUserComponent) { }
  chatBtn: string = "btn-primary";
  usersBtn: boolean = false;
  usersDetail: boolean = false;

  allUser = []

  ngOnInit(): void {
    this.getAllUser()

  }

  getAllUser() {
    console.log("In all user")
    this.remoteUser.dataEmitter.subscribe((data) => {
      console.log(data, "BBB")
      this.allUser = data;
    })

  }

  onUsers() {
    this.usersBtn = !this.usersBtn
    this.usersDetail = !this.usersDetail
  }

}
