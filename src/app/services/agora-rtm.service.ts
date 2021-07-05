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
  onChannelMessage = (message, memberId) => {
    let emitData = { type: 'ChannelMessage', message: message.text, memberId };
    console.log(emitData, "Data emitted")
    this.agora2.emit(emitData);
  }
  onMemberJoin() {

  }
  onMemberLeft() {

  }

  sendPeerMessage(peerId, message) {
    //processing
    //use send message func
  }

  sendChannelMessage(data, id) {
    //processing
    //use send message func
    // console.log(userId, data)
    if (data) {
      this.sendMessage({ msg: data.message, type: 'channelMessage', userId: id })
    }
  }

  async sendMessage(data) {
    console.log("In send message fn", data)
    // data.msg = data.msg + "%$#@!" + data.userId 
    // if (message.type === 'channelMessage') {
    await this.rtm.channel.sendMessage({ "text": data.msg, "messageType": "TEXT" })
    // }
  }



}
