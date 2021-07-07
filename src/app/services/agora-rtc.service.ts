import { EventEmitter, Injectable } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  UID,
} from "agora-rtc-sdk-ng";
import { environment } from "../../environments/environment"
import { AgoraRtmService } from './agora-rtm.service';

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
  public agora1 = new EventEmitter<any>();

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


  constructor(private agoraRTM: AgoraRtmService) {

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
    this.publisher.tracks;
    this.publisher.client.enableAudioVolumeIndicator();
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

  async publishScreenTrack() {
    if (this.screenPublish.tracks.screen) {
      this.screenPublish.client.publish([this.screenPublish.tracks.screen]);

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
      encoderConfig: "720p_1",
    }).then(localScreenTrack => {
      this.screenPublish.tracks.screen = localScreenTrack;
      console.log(localScreenTrack)
    });

    this.screenjoin().then(
      () => {
        this.publishScreenTrack()
      }
    )
  }


  registerClientEvents() {
    this.publisher.client.on('user-published', this.onUserPublished);
    this.publisher.client.on('user-unpublished', this.onUserUnpublished);
    this.publisher.client.on('user-joined', this.onUserJoined);
    this.publisher.client.on('user-left', this.onUserLeft);
    this.publisher.client.on('volume-indicator', this.volumeIndicatorHandler);
  }

  unregisterCallbacks() {
    this.publisher.client.off('user-published', this.onUserPublished);
    this.publisher.client.off('user-unpublished', this.onUserUnpublished);
    this.publisher.client.off('user-joined', this.onUserJoined);
    this.publisher.client.off('user-left', this.onUserLeft);
    this.publisher.client.off('volume-indicator', this.volumeIndicatorHandler);
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

  setRemoteStreamType(userId, type) {
    let flag = 0;
    if (this.publisher.client) {
      if (type == 'low') {
        flag = 1;
      }
      if (type == 'high') {
        flag = 0;
      }
      this.publisher.client.setRemoteVideoStreamType(userId, flag);
    }
  }

  volumeIndicatorHandler = async (result) => {
    console.log("volume")
    let emitData = { type: 'volume-indicator', result };
    this._agora.emit(emitData);
  };

  getMember() {
    this.agoraRTM.rtm.channel.getMembers()
      .then((data) => {
        console.log(data, "emit")
        this.agora1.emit(data);
      })
  }


  onUserPublished = async (user, mediaType) => {
    console.log(user, "IN user published")
    const uid = user.uid;
    this.getMember()
    if (user.uid !== "anshulScreen") {
      await this.publisher.client.subscribe(user, mediaType);
    }
    await this.publisher.client.setStreamFallbackOption(uid, 1);
    if (mediaType === 'video') {
      this.setRemoteStreamType(uid, 'low');
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
