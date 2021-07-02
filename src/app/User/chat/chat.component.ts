import { Component, OnInit } from '@angular/core';
import { AgoraRtmService } from 'src/app/services/agora-rtm.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatBtn: boolean = false;
  usersDetail: boolean = false;
  constructor(private agoraRTM: AgoraRtmService) { } //private agoraRTM: AgoraRtmService


  ngOnInit(): void {
  }

  onChat() {
    this.chatBtn = !this.chatBtn;
    this.usersDetail = !this.usersDetail
  }

}
