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
  elementId: string;

  allUser = [
    // { name: 'Anshul Singh', email: 'anshul@bigsteptech.com' },
    { name: 'Madhur Jain', email: 'madhur@bigsteptech.com', },
    // { name: 'Mansi Gupta', email: 'mansi@bigsteptech.com' },
    // { name: 'Rohan Kumawat', email: 'rohan@bigsteptech.com' },
    // { name: 'Kailash Malveeya', email: 'kailash@bigsteptech.com' }
  ]

  ngOnInit(): void {
    console.log("Hey there")
    this.faMicrophoneOn = faMicrophone;
    this.faMicrophoneOff = faMicrophoneSlash;
    this.faVideoOff = faVideoSlash;
    this.faVideoOn = faVideo;
    this.elementId = "remote-user-madhurjain";
    this.remoteStreams()
  }


  async remoteStreams() {

  }

}
