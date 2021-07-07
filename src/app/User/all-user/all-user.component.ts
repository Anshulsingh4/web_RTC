import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.css']
})
export class AllUserComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  chatBtn: string = "btn-primary";
  usersBtn: boolean = false;
  usersDetail: boolean = false;
  userName: string;
  allUser = []

  ngOnInit(): void {

  }

}
