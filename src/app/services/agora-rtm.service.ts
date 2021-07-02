
import { Injectable } from '@angular/core';
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
    uid: "anshul",
    token: null
  }

  constructor() {
    this.rtm = {
      client: {}
    }
    this.initRtmSession()
  }

  async initRtmSession() {
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
    console.log("I am in jOIn channel")

    let channel = this.rtm.client.createChannel('1234')

    console.log(channel, "I am channel")



    //Join Channel.


    //register Channel and Client events
    // this.registerClientEvents()
    // this.registerChannelEvents()

  }

  registerClientEvents() {
    //register all the client events & emit the event
    // this.client.on('MessageFromPeer', this.onMessageFromPeer);
    // this.client.on('ConnectionStateChanged', this.onConnectionStateChanged);
  }

  registerChannelEvents() {
    //register all the channel events & emit the event
    // this.channel.on('ChannelMessage', this.onChannelMessage);
    // this.channel.on('MemberJoined', this.onMemberJoin);
    // this.channel.on('MemberLeft', this.onMemberLeft);

  }

  sendPeerMessage(peerId, message) {
    //processing
    //use send message func
  }

  sendChannelMessage(message) {
    //processing
    //use send message func
  }

  sendMessage() {
    //
  }



}