import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgoraRTCService } from "../../services/agora-rtc.service"
@Component({
  selector: 'app-vide-meet',
  templateUrl: './vide-meet.component.html',
  styleUrls: ['./vide-meet.component.css']
})
export class VideMeetComponent implements OnInit {

  constructor(private agoraRTC: AgoraRTCService,
    private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
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


}
