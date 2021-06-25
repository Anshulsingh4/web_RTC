import { Component, OnInit } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash } from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {

  constructor() { }

  faMicrophoneOn;
  faMicrophoneOff;
  faVideoOn;
  faVideoOff;

  allUser = [
    { name: 'Anshul Singh', email: 'anshul@bigsteptech.com' },
    { name: 'Madhur Jain', email: 'madhur@bigsteptech.com' },
    { name: 'Mansi Gupta', email: 'mansi@bigsteptech.com' },
    { name: 'Rohan Kumawat', email: 'rohan@bigsteptech.com' },
    { name: 'Kailash Malveeya', email: 'kailash@bigsteptech.com' }
  ]

  ngOnInit(): void {
    this.faMicrophoneOn = faMicrophone;
    this.faMicrophoneOff = faMicrophoneSlash;
    this.faVideoOff = faVideoSlash;
    this.faVideoOn = faVideo;
  }

}
