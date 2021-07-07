import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash } from "@fortawesome/free-solid-svg-icons"
import { AgoraRTCService } from 'src/app/services/agora-rtc.service';


@Component({
  selector: 'app-remote-user',
  templateUrl: './remote-user.component.html',
  styleUrls: ['./remote-user.component.css']
})
export class RemoteUserComponent implements OnInit {
  @Output() data = new EventEmitter<any>();
  ids: [any];
  id: any;

  public dataEmitter = new EventEmitter<any>()

  constructor(private agoraRTC: AgoraRTCService) { }
  faMicrophoneOn;
  faMicrophoneOff;
  faVideoOn;
  faVideoOff;

  allUser = {}

  ngOnInit(): void {
    this.faMicrophoneOn = faMicrophone;
    this.faMicrophoneOff = faMicrophoneSlash;
    this.faVideoOff = faVideoSlash;
    this.faVideoOn = faVideo;
    this.registerAgoraEvents()
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
        document.getElementById(`${array[i].uid}`).style.border = "4px solid black";
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
      remoteAudioTrack.play();
      this.allUser[data.user.uid].isAudioEnabled = true
    }
    if (data.mediaType === 'video') {  //&& data.user.uid !== "ScreenShare"
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
    // if (data.mediaType === 'video' && data.user.uid === "ScreenShare") {
    //   this.allUser[data.user.uid].videoStream = data.user.videoTrack;
    //   this.allUser[data.user.uid].isVideoEnabled = true
    //   const remoteVideoTrack = data.user.videoTrack;

    //   const remotePlayerContainer = document.createElement("div");
    //   remotePlayerContainer.id = data.user.uid.toString();
    //   remotePlayerContainer.style.width = "1100px";
    //   remotePlayerContainer.style.height = "650px";
    //   remotePlayerContainer.style.margin = "15px";
    //   document.getElementById('remote-screen').append(remotePlayerContainer);
    //   remoteVideoTrack.play(remotePlayerContainer);

    // }
  }


  async removeRemoteUser(data) {
    let userElement = this.allUser[data.user.uid];
    let id = data.user.uid.toString();
    if (data.mediaType == "video" && data.user.uid !== "ScreenShare") {
      userElement.videoStream = null;
      userElement.isVideoEnabled = false;
    }
    if (data.mediaType == "video" && data.user.uid === "ScreenShare") {
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