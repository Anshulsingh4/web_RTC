import { EventEmitter, Injectable } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  UID,
} from "agora-rtc-sdk-ng";
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class AgoraRTCService {
  publisher: any = {
    tracks: {
      video: {},
      audio: {}
    }
  };

  public streaming = new EventEmitter<boolean>();

  remoteStreams: any[] = [];
  credentials = {
    channelID: "",
    token: null,
    userId: null,
    appId: ""
  };


  constructor() {

    this.publisher.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    this.credentials = {
      channelID: "1234",
      token: null,
      userId: null,
      appId: environment.appId
    }
  }

  async createVideoTrack() {
    // Create a video track from the video captured by a camera.
    this.publisher.tracks.video = await AgoraRTC.createCameraVideoTrack();
    console.log(this.publisher)
  }

  async createAudioTrack() {
    // Create an audio track from the audio sampled by a microphone.
    this.publisher.tracks.audio = await AgoraRTC.createMicrophoneAudioTrack();
  }

  async createBothTracks() {
    try {
      await this.createVideoTrack();
      await this.createAudioTrack();

    }
    catch (err) {
      throw err;
    }
  }

  join(): Promise<UID> {
    if (this.publisher.client) {
      return this.publisher.client.join(
        this.credentials.appId,
        this.credentials.channelID,
        this.credentials.token
      );
    }
  }

  async publish() {
    await this.publisher.client.setClientRole("host")
    return this.publisher.client.publish([
      this.publisher.tracks.audio,
      this.publisher.tracks.video,
    ]);
  }

  startCall() {
    this.publisher.client.on("user-published", async (user, mediaType) => {
      await this.publisher.client.subscribe(user, mediaType);
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;
        const newContainer = document.createElement("div");
        newContainer.id = user.uid.toString();
        newContainer.style.width = "640px";
        newContainer.style.height = "480px";
        document.body.append(newContainer);

        remoteVideoTrack.play(newContainer);
      }
      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    });
  }



}
