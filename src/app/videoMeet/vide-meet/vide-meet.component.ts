import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgoraRTCService } from "../../services/agora-rtc.service"

import { AgoraRtmService } from "../../services/agora-rtm.service"
@Component({
  selector: 'app-vide-meet',
  templateUrl: './vide-meet.component.html',
  styleUrls: ['./vide-meet.component.css']
})
export class VideMeetComponent implements OnInit {

  chatBtn = true;
  allUserBtn = false;
  btnColor = 'btn-primary'
  btnUsersColor: string;
  btnChatColor: string = 'btn-primary';
  cnt = 0;
  constructor(private agoraRTC: AgoraRTCService,
    private agoraRTM: AgoraRtmService,
    private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.agoraRTM.initRtmSession(params.get('userId'))
      this.agoraRTC.createBothTracks().then(() => {
        this.agoraRTC.streaming.next(true)
        console.log(params, "FFFFFFF")

        this.agoraRTC.join(params.get('userId')).then(
          () => {
            this.agoraRTC.publish()
            // this.agoraRTC.startCall()
          }
        )
      }
      )
    });
  }

  onChat() {
    this.chatBtn = true;
    this.allUserBtn = false;
    this.btnChatColor = 'btn-primary'
    this.btnUsersColor = 'btn-secondary'


  }

  onAllUser() {
    this.chatBtn = false;
    this.allUserBtn = true;
    this.btnUsersColor = 'btn-primary'
    this.btnChatColor = 'btn-secondary'
  }


}
