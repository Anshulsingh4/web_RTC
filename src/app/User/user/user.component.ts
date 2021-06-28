import { Component, OnDestroy, OnInit } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash } from "@fortawesome/free-solid-svg-icons"
import { AgoraRTCService } from '../../services/agora-rtc.service';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  constructor(private agoraRTC: AgoraRTCService) {
    this.sub = this.agoraRTC.streaming.pipe(
      tap(() => this.showPublisher())
    ).subscribe();
  }

  mic: boolean = false;
  video: boolean = false;
  screenShare: boolean = false;
  chatBtn: string = "btn-primary";
  usersBtn: string;
  usersDetail: boolean = false;
  faMicrophoneOn;
  faMicrophoneOff;
  faVideoOn;
  faVideoOff;
  faPhoneSlash;
  loading = true;

  elementId: string;
  screenId: string;

  allUser = [
    { name: 'Anshul Singh', email: 'anshul@bigsteptech.com' },
    { name: 'Madhur Jain', email: 'madhur@bigsteptech.com' },
    { name: 'Mansi Gupta', email: 'mansi@bigsteptech.com' },
    { name: 'Rohan Kumawat', email: 'rohan@bigsteptech.com' },
    { name: 'Kailash Malveeya', email: 'kailash@bigsteptech.com' },
  ]

  ngOnInit(): void {
    this.faMicrophoneOn = faMicrophone;
    this.faMicrophoneOff = faMicrophoneSlash;
    this.faVideoOff = faVideoSlash;
    this.faVideoOn = faVideo;
    this.faPhoneSlash = faPhoneSlash
    this.elementId = `user-stream-1234`
    this.initialiseStream()
  }

  private showPublisher() {
    if (this.agoraRTC.publisher.tracks.video) {
      this.agoraRTC.publisher.tracks.video.play(this.elementId);
      this.loading = false;
    }
  }

  async initialiseStream() {
    this.agoraRTC.publisher.tracks.video.play(this.elementId);
    // this.agoraRTC.publisher.tracks.audio.play()
  }



  onMic() {
    this.mic = !this.mic
  }

  async onVideo() {

    if (this.video) {
      await this.agoraRTC.createBothTracks();
      this.agoraRTC.publisher.tracks.video.play(this.elementId);
      // this.agoraRTC.publisher.tracks.audio.play();
    }
    else {
      this.agoraRTC.publisher.tracks.video.close();
      // this.agoraRTC.publisher.tracks.audio.close();
    }
    this.video = !this.video;

  }

  async onScreenShare() {
    this.screenShare = !this.screenShare
    if (this.screenShare) {
      await this.agoraRTC.createScreenTrack();
      this.agoraRTC.screenPublish.tracks.screen.play(this.screenId);
    }
    else {
      this.agoraRTC.screenPublish.tracks.screen.close();
    }


  }


  onChat() {
    this.chatBtn = "btn-primary"
    this.usersBtn = ""
    this.usersDetail = !this.usersDetail
  }

  onUsers() {
    this.usersBtn = "btn-primary"
    this.chatBtn = ""
    this.usersDetail = !this.usersDetail
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
