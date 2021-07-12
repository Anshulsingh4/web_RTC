import { Component, OnDestroy, OnInit } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash } from "@fortawesome/free-solid-svg-icons"
import { AgoraRTCService } from '../../services/agora-rtc.service';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { AgoraRtmService } from 'src/app/services/agora-rtm.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  constructor(private agoraRTC: AgoraRTCService,
    private route: ActivatedRoute,
    private router: Router,
    private agoraRTM: AgoraRtmService) {
    this.sub = this.agoraRTC.streaming.pipe(
      tap(() => this.showPublisher())
    ).subscribe();

  }
  userName: String;
  mic: boolean = false;
  video: boolean = false;
  screen: boolean = false;
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
    this.route.params.subscribe((param) => {
      this.userName = param.userId
    })
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
    // this.mic = !this.mic
  }


  async onScreenShare() {

    if (!this.screen) {
      const attributes = await this.agoraRTM.rtm.client.getChannelAttributes('1234')
      if (false) { //attributes.screenShare && attributes.screenShare.value === "true"
        console.log(attributes.screenShare, "att")

        alert("You can't share your screen . Screen sharing is limited to One")
      }
      else {
        await this.agoraRTC.createScreenTrack();
        await this.agoraRTM.rtm.client.setChannelAttributes('1234', { screenShare: "true" })
        this.agoraRTC.screenPublish.tracks.screen.setEnabled(true);

        console.log(this.agoraRTM.rtm.client.getChannelAttributes('1234'), "att")

        this.screen = !this.screen;
      }
    }
    else {
      this.screen = !this.screen;
      await this.agoraRTM.rtm.client.setChannelAttributes('1234', { screenShare: "false" })
      this.agoraRTC.screenPublish.tracks.screen.setEnabled(false);
    }
  }



  onEndCall() {
    this.router.navigate([''])
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
