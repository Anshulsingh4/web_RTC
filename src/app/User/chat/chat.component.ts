import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AgoraRtmService } from 'src/app/services/agora-rtm.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages = [];
  chatBtn: boolean = false;
  usersDetail: boolean = false;
  cnt = 0;

  constructor(private agoraRTM: AgoraRtmService, private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.registerAgoraRTMEvents()
  }

  registerAgoraRTMEvents() {
    this.agoraRTM.agora2.subscribe((data) => {
      switch (data.type) {
        case 'ChannelMessage': this.addMessage(data)
          break;
      }
    })
  }

  addMessage(data) {
    console.log(data, "Chat")
    this.messages.push(data)
  }

  onChat() {
    this.chatBtn = !this.chatBtn;
    this.usersDetail = !this.usersDetail
  }

  onSubmit(data: NgForm) {
    let userId;
    this.route.params.subscribe(param => {
      userId = param.userId
    })
    this.messages.push({ message: data.value.message, memberId: userId })


    console.log(data.value, "I am data")
    this.agoraRTM.sendChannelMessage(data.value, userId.toString())
    data.reset()

  }


}
