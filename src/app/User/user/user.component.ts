import { Component, OnDestroy, OnInit } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash } from "@fortawesome/free-solid-svg-icons"
import { AgoraRTCService } from '../../services/agora-rtc.service';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  constructor(private agoraRTC: AgoraRTCService,
    private router: Router) {
    this.sub = this.agoraRTC.streaming.pipe(
      tap(() => this.showPublisher())
    ).subscribe();
  }

  mic: boolean = false;
  video: boolean = false;
  screenShare: boolean = false;
  // chatBtn: string = "btn-primary";
  // usersBtn: string;
  // usersDetail: boolean = false;
  faMicrophoneOn;
  faMicrophoneOff;
  faVideoOn;
  faVideoOff;
  faPhoneSlash;
  loading = true;

  elementId: string;
  screenId: string = 'anshul';


  ngOnInit(): void {
    this.faMicrophoneOn = faMicrophone;
    this.faMicrophoneOff = faMicrophoneSlash;
    this.faVideoOff = faVideoSlash;
    this.faVideoOn = faVideo;
    this.faPhoneSlash = faPhoneSlash
    this.elementId = `user-stream-1234`
  }

  private showPublisher() {
    if (this.agoraRTC.publisher.tracks.video) {
      this.agoraRTC.publisher.tracks.video.play(this.elementId);
      this.loading = false;
    }
  }

  async onMic() {
    if (this.mic) {

      this.agoraRTC.publisher.tracks.audio.setEnabled(true);
    }
    else {
      this.agoraRTC.publisher.tracks.audio.setEnabled(false);
    }
    this.mic = !this.mic
  }

  async onVideo() {

    if (this.video) {
      // await this.agoraRTC.createBothTracks();
      this.agoraRTC.publisher.tracks.video.setEnabled(true);
    }
    else {
      this.agoraRTC.publisher.tracks.video.setEnabled(false);
    }
    this.video = !this.video;
    this.mic = !this.mic
  }

  async onScreenShare() {

    if (!this.screenShare) {
      await this.agoraRTC.createScreenTrack();
      this.agoraRTC.screenPublish.tracks.screen.play(this.screenId);
    }
    else {
      this.agoraRTC.screenPublish.tracks.screen.close();
    }
    this.screenShare = !this.screenShare
  }

  onEndCall() {
    this.router.navigate([''])
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
