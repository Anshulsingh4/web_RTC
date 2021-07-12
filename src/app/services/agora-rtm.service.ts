import { EventEmitter, Injectable } from '@angular/core';
import AgoraRTM from 'agora-rtm-sdk'
import { environment } from "../../environments/environment"
@Injectable({
  providedIn: 'root'
})
export class AgoraRtmService {
  rtm: any = {
    client: {}
  }
  channel = {}
  options = {
    uid: "",
    token: null
  }
  public agora2 = new EventEmitter<any>();



  constructor() {

  }

  async initRtmSession(uid) {
    this.options.uid = uid;
    try {
      this.rtm.client = await AgoraRTM.createInstance(environment.appId, { enableLogUpload: false });
      await this.rtm.client.login(this.options)
      this.joinChannel()
    }
    catch (err) {
      console.log(err, 'Error')
    }
  }

  joinChannel() {
    //create Channel
    console.log("I am in Join channel")

    this.rtm.channel = this.rtm.client.createChannel('1234')

    console.log(this.rtm.channel, "I am channel")
    //register Channel and Client events
    this.rtm.channel.join();
    this.registerClientEvents()
    this.registerChannelEvents()

  }

  registerClientEvents() {
    //register all the client events & emit the event
    this.rtm.client.on('MessageFromPeer', this.onMessageFromPeer);
    this.rtm.client.on('ConnectionStateChanged', this.onConnectionStateChanged);
  }

  registerChannelEvents() {
    //register all the channel events & emit the event
    this.rtm.channel.on('ChannelMessage', this.onChannelMessage);
    this.rtm.channel.on('MemberJoined', this.onMemberJoin);
    this.rtm.channel.on('MemberLeft', this.onMemberLeft);

  }

  onMessageFromPeer() {

  }
  onConnectionStateChanged() {

  }
  onChannelMessage = async (message, memberId) => {
    if (message.messageType === 'IMAGE') {
      console.log(message, "ch")
      const blob = await this.rtm.client.downloadMedia(message.mediaId)
      console.log(blob, "blob")
      let emitData = { type: 'ChannelMessage', blob, msg: message, memberId, self: false };
      this.agora2.emit(emitData);
    }
    if (message.messageType == "TEXT") {
      let emitData = { type: 'ChannelMessage', msg: message, memberId, self: false };
      console.log(emitData)
      this.agora2.emit(emitData);
    }
  }
  onMemberJoin() {

  }
  onMemberLeft() {

  }

  sendPeerMessage(peerId, message) {
    //processing
    //use send message func
  }

  sendChannelMessage(message) {
    if (message) {
      this.sendMessage({ message, type: "channel" })
    }

  }

  async sendMessage(data) {
    console.log("In send message fn", data)
    await this.rtm.channel.sendMessage({ "text": data.message.message, "messageType": "TEXT" })
  }

  async sendImage(file) {
    const mediaMessage = await this.rtm.client.createMediaMessageByUploading(file, {
      messageType: 'IMAGE',
      fileName: file.name,
      description: 'send image',
    })
    console.log(mediaMessage, "media")
    this.rtm.channel.sendMessage(mediaMessage).then(() => {
      console.log("Your code for handling the event when the channel message is successfully sent.")
    }).catch(error => {
      console.log(error)
    });



  }
}
