import { Component, EventEmitter, OnInit } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash } from "@fortawesome/free-solid-svg-icons"
import { AgoraRTCService } from 'src/app/services/agora-rtc.service';


@Component({
  selector: 'app-remote-user',
  templateUrl: './remote-user.component.html',
  styleUrls: ['./remote-user.component.css']
})
export class RemoteUserComponent implements OnInit {

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
      switch (data.type) {
        case 'user-published': this.addRemoteUser(data)
          break;
        case "user-unpublished": this.removeRemoteUser(data)
          break;
      }
    })
  }

  addRemoteUser(data) {
    console.log(this.allUser, 'ALLUSER')
    console.log(data, "Anshul Singh")
    if (!(this.allUser[data.user.uid])) {
      let userData = {
        userId: data.user.uid,
        elementId: `remote-stream-${data.user.uid}`,
        name: data.user.uid,
        isAudioEnabled: false,
        isVideoEnabled: false,
        videoStream: null,
        audioStream: null
      }
      this.allUser[data.user.uid] = userData;
    }

    if (data.mediaType === 'audio') {
      this.allUser[data.user.uid].audioStream = data.user.audioTrack;
      const remoteAudioTrack = data.user.audioTrack;
      remoteAudioTrack.play();
      this.allUser[data.user.uid].isAudioEnabled = true
    }

    if (data.mediaType === 'video' && data.user.uid !== 'anshulScreen') {

      this.allUser[data.user.uid].videoStream = data.user.videoTrack;
      this.allUser[data.user.uid].isVideoEnabled = true
      const remoteVideoTrack = data.user.videoTrack;
      const remotePlayerContainer = document.createElement("div");
      remotePlayerContainer.id = data.user.uid.toString();
      remotePlayerContainer.textContent = "User Id:" + data.user.uid.toString();
      remotePlayerContainer.className = "remote-video-box";
      remotePlayerContainer.style.width = "500px";
      remotePlayerContainer.style.height = "350px";
      // remotePlayerContainer.style.margin = "15px";
      document.getElementById('remote-video').append(remotePlayerContainer);
      remoteVideoTrack.play(remotePlayerContainer);
      let emitData = []
      for (let users in this.allUser) {
        emitData.push(users)
      }
      this.dataEmitter.emit(emitData)
      console.log(emitData, "AAA")
    }

  }

  removeRemoteUser(data) {
    if (data.mediaType == "video") {
      let id = data.user.uid.toString();
      document.getElementById(id).remove();
      delete this.allUser[data.user.uid]
    }
  }
}