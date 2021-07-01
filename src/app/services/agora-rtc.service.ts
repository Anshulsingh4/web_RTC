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
  public _agora = new EventEmitter<any>();

  remoteStreams: any[] = [];
  credentials = {
    channelID: "",
    token: null,
    userId: null,
    appId: ""
  };
  screenPublish: any = {
    tracks: {
      screen: {}
    }
  };


  constructor() {

    this.publisher.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    this.screenPublish.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    this.credentials = {
      channelID: "1234",
      token: null,
      userId: null,
      appId: environment.appId
    }
  }

  async createVideoTrack() {
    // Create a video track from the video captured by a camera.
    this.publisher.tracks.video = await AgoraRTC.createCameraVideoTrack({ encoderConfig: '120p_1' });
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

  join(userId): Promise<UID> {
    if (this.publisher.client) {
      this.registerClientEvents()
      return this.publisher.client.join(
        this.credentials.appId,
        this.credentials.channelID,
        this.credentials.token,
        userId
      );
    }
  }

  screenjoin(): Promise<UID> {
    if (this.screenPublish.client && environment) {
      // this.setScreenEvent();
      return this.screenPublish.client.join(
        this.credentials.appId,
        this.credentials.channelID,
        this.credentials.token,
        'anshulScreen',

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

  async createScreenTrack() {
    // this.screenPublish.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    await AgoraRTC.createScreenVideoTrack({
      encoderConfig: "1080p_1",
    }).then(localScreenTrack => {
      this.screenPublish.tracks.screen = localScreenTrack;
      console.log(localScreenTrack)
    });

    this.screenjoin().then(
      () => {
        return this.screenPublish.client.publish([this.screenPublish.tracks.screen]);
      }
    )
  }


  registerClientEvents() {
    this.publisher.client.on('user-published', this.onUserPublished);
    this.publisher.client.on('user-unpublished', this.onUserUnpublished);
    this.publisher.client.on('user-joined', this.onUserJoined);
    this.publisher.client.on('user-left', this.onUserLeft);
  }

  onScreenPublished = async (user, mediaType) => {
    const uid = user.uid;
    await this.screenPublish.client.subscribe(user, mediaType);
    // await this.publisher.client.setStreamFallbackOption(uid, 1);
    if (mediaType === 'video') {
      // this.setRemoteStreamType(uid, 'low');
    }
    if (mediaType === 'audio') {
    }
    let emitData = { type: 'user-published', user, mediaType };
    this._agora.emit(emitData);
  }


  onUserPublished = async (user, mediaType) => {
    console.log(user, "IN user published")
    const uid = user.uid;
    if (user.uid !== "anshulScreen") {
      await this.publisher.client.subscribe(user, mediaType);
    }
    // await this.publisher.client.setStreamFallbackOption(uid, 1);
    if (mediaType === 'video') {
      // this.setRemoteStreamType(uid, 'low');
    }
    if (mediaType === 'audio') {
    }
    let emitData = { type: 'user-published', user, mediaType };
    this._agora.emit(emitData);

  }

  onUserUnpublished = async (user, mediaType) => {

    await this.publisher.client.unsubscribe(user, mediaType);
    if (mediaType === 'video') {
      console.log('unsubscribe video success');
    }
    if (mediaType === 'audio') {
      console.log('unsubscribe audio success');
    }
    let emitData = { type: 'user-unpublished', user, mediaType };
    this._agora.emit(emitData);

  };

  onUserJoined() { }

  onUserLeft() { }


}
