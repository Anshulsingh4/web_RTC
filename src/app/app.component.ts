import { Component } from '@angular/core';
import { AgoraRTCService } from "./services/agora-rtc.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project1';

  constructor(private agoraRTC: AgoraRTCService) {
    this.agoraRTC.createBothTracks().then(() => {
      this.agoraRTC.streaming.next(true)
      this.agoraRTC.join().then(
        () => {
          this.agoraRTC.publish()
          this.agoraRTC.startCall()
        }
      )
    }
    )

  }



}
