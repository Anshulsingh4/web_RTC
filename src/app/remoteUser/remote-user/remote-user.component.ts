import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash } from "@fortawesome/free-solid-svg-icons"
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AgoraRTCService } from 'src/app/services/agora-rtc.service';


@Component({
  selector: 'app-remote-user',
  templateUrl: './remote-user.component.html',
  styleUrls: ['./remote-user.component.css']
})
export class RemoteUserComponent implements OnInit {
  @Output() data = new EventEmitter<any>();

  public dataEmitter = new EventEmitter<any>()
  remoteScreen: boolean = false;
  public sub: Subscription

  constructor(private agoraRTC: AgoraRTCService) {
    this.sub = this.agoraRTC.streaming.pipe(
      tap(() => this.showPublisher())
    ).subscribe();
  }
  faMicrophoneOn;
  faMicrophoneOff;
  faVideoOn;
  faVideoOff;
  remoteUserScreen;
  remoteUser
  allUser = {}
  localUser = {
    userId: null,
    elementId: null,
    isAudioEnabled: false,
    isVideoEnabled: false,
    videoStream: null,
    audioStream: null,
  }

  ngOnInit(): void {
    this.faMicrophoneOn = faMicrophone;
    this.faMicrophoneOff = faMicrophoneSlash;
    this.faVideoOff = faVideoSlash;
    this.faVideoOn = faVideo;
    this.initLocalStream()
    this.registerAgoraEvents()
  }

  private showPublisher() {
    if (this.agoraRTC.publisher.tracks.video) {
      this.agoraRTC.publisher.tracks.video.play(this.localUser.elementId);
    }
  }



  async initLocalStream() {
    this.localUser = {
      userId: this.agoraRTC.userId,
      elementId: `remote-stream-${this.agoraRTC.userId}`,
      isAudioEnabled: false,
      isVideoEnabled: false,
      videoStream: null,
      audioStream: null,
    }
    console.log("Hello", this.agoraRTC.publisher.tracks.video)
    // this.localUser.videoStream = await this.agoraRTC.publisher.tracks.video
    // this.localUser.videoStream.play(this.localUser.elementId)


  }

  registerAgoraEvents() {
    this.agoraRTC._agora.subscribe((data) => {
      console.log("main", data)
      switch (data.type) {
        case 'user-published': this.addRemoteUser(data)
          break;
        case "user-unpublished": this.removeRemoteUser(data)
          break;
        case "volume-indicator": this.volumeIndicator(data)
          break;

      }
    })
  }


  async volumeIndicator(data) {

    try {
      let array = data.result.sort(data.result.level).reverse();
      if (array[0].level > 1)
        document.getElementById(`${array[0].uid}`).style.border = "4px solid red";
      for (let i = 1; i < array.length; i++) {
        document.getElementById(`${array[i].uid}`).style.border = "none";
      }
    }
    catch (err) {
    }

  }

  addRemoteUser(data) {
    if (!this.allUser[data.user.uid]) {
      let userData = {
        userId: data.user.uid,
        elementId: `remote-stream-${data.user.uid}`,
        name: "User",
        isAudioEnabled: false,
        isVideoEnabled: false,
        videoStream: null,
        audioStream: null,

      }
      console.log("all user", this.allUser);
      this.allUser[data.user.uid] = userData;

    }
    if (data.mediaType === 'audio') {
      this.allUser[data.user.uid].audioStream = data.user.audioTrack;
      const remoteAudioTrack = data.user.audioTrack;
      // remoteAudioTrack.play();
      this.allUser[data.user.uid].isAudioEnabled = true
    }
    if (data.mediaType === 'video' && data.user.uid !== `${this.agoraRTC.userId}-Screen`) {  //&& data.user.uid !== "ScreenShare"
      this.allUser[data.user.uid].videoStream = data.user.videoTrack;
      this.allUser[data.user.uid].isVideoEnabled = true
      const remoteVideoTrack = data.user.videoTrack;

      const remotePlayerContainer = document.createElement("div");
      remotePlayerContainer.id = data.user.uid.toString();
      remotePlayerContainer.style.width = "380px";
      remotePlayerContainer.style.height = "350px";
      remotePlayerContainer.style.margin = "15px";
      document.getElementById('remote-video').append(remotePlayerContainer);
      remoteVideoTrack.play(remotePlayerContainer);
    }

  }


  async removeRemoteUser(data) {
    let userElement = this.allUser[data.user.uid];
    let id = data.user.uid.toString();
    if (data.mediaType == "video" && data.user.uid.split('-')[1] !== 'Screen') {
      userElement.videoStream = null;
      userElement.isVideoEnabled = false;
    }
    else if (data.mediaType == "video" && data.user.uid.split('-')[1] !== 'Screen') {
      userElement.videoStream = null;
      userElement.isVideoEnabled = false;
      document.getElementById('remote-screen').remove()
    }
    else if (data.mediaType == "audio") {
      userElement.audioStream = null;
      userElement.isAudioEnabled = false;
    }
    if (!userElement.isAudioEnabled && !userElement.isVideoEnabled) {
      document.getElementById(`${id}`).remove();
    }
  }
}



//data.user.uid.split('-')[1] !== 'Screen'