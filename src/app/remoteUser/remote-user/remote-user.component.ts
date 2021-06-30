import { Component, OnInit } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash } from "@fortawesome/free-solid-svg-icons"
import { AgoraRTCService } from 'src/app/services/agora-rtc.service';


@Component({
  selector: 'app-remote-user',
  templateUrl: './remote-user.component.html',
  styleUrls: ['./remote-user.component.css']
})
export class RemoteUserComponent implements OnInit {


  constructor(private agoraRTC: AgoraRTCService) { }
  faMicrophoneOn;
  faMicrophoneOff;
  faVideoOn;
  faVideoOff;
  cnt = 0;

  allUser = {

  }

  ngOnInit(): void {
    this.faMicrophoneOn = faMicrophone;
    this.faMicrophoneOff = faMicrophoneSlash;
    this.faVideoOff = faVideoSlash;
    this.faVideoOn = faVideo;
    this.registerAgoraEvents()

    // this.remoteStreams()
  }

  registerAgoraEvents() {
    this.agoraRTC._agora.subscribe((data) => {
      switch (data.type) {
        case 'user-published': this.addRemoteUser(data)
          break;
        // case "user-unpublished": this.removeRemoteUser(data)
      }
    })
  }

  addRemoteUser(data) {
    console.log(this.allUser, 'ALLUSER')
    console.log(data, "Anshul Singh")

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
    if (data.mediaType === 'audio') {
      this.allUser[data.user.uid].audioStream = data.user.audioTrack;
      this.allUser[data.user.uid].audioStream.play()
      this.allUser[data.user.uid].isAudioEnabled = true
    }
    if (data.mediaType === 'video') {
      console.log(data.user.videoTrack, "LLLLLLL")
      this.allUser[data.user.uid].videoStream = data.user.videoTrack;
      if (this.allUser[data.user.uid].videoStream) {
        try {
          this.checkElementExistent(this.allUser[data.user.uid].elementId).then((ele) => {
            setTimeout(() => {
              this.allUser[data.user.uid].videoStream.play(this.allUser[data.user.uid].elementId)
            }, 1000);


          });
        }
        catch (err) {
          console.log(err, "DOM ERROR")
          console.log("Hello from catch")
          setTimeout(
            () => {
              this.allUser[data.user.uid].videoStream.play(this.allUser[data.user.uid].elementId)
            }
            , 1000)
        }

        this.allUser[data.user.uid].isVideoEnabled = true
      }
    }
    console.log(this.allUser, "Anshul Chouhan")


  }

  checkElementExistent(id) {
    return new Promise((res, rej) => {
      let ele = document.getElementById(id);
      if (ele) {
        res(ele);
      } else {
        setInterval(() => {
          let ele = document.getElementById(id);
          if (ele) {
            res(ele);
          }
        }, 100);
      }
    });
  }

  // removeRemoteUser(data) {

  // }

}
