import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgoraRTCService } from "./services/agora-rtc.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project1';

  constructor() { }

}
