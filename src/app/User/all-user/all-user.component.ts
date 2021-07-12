import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgoraRTCService } from 'src/app/services/agora-rtc.service';

@Component({
  selector: 'app-all-user',
  templateUrl: './all-user.component.html',
  styleUrls: ['./all-user.component.css']
})
export class AllUserComponent implements OnInit {

  constructor(private agoraRTC: AgoraRTCService, private route: ActivatedRoute) { }
  chatBtn: string = "btn-primary";
  usersBtn: boolean = false;
  usersDetail: boolean = false;
  userName: string;
  allUser = []

  ngOnInit(): void {
    this.agoraRTC.agora1.subscribe((data) => {
      console.log(data, "Get Member")
      this.allUser = data
    })
  }

}
