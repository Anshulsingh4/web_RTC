import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AgoraRtmService } from 'src/app/services/agora-rtm.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message = [];
  chatBtn: boolean = false;
  usersDetail: boolean = false;
  cnt = 0;
  image = []
  userId = ""
  files; any;
  flag = false;

  constructor(private agoraRTM: AgoraRtmService, private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      let id = param['id']
      this.userId = id
    })
    this.messageReciver();
  }

  messageReciver() {
    this.agoraRTM.agora2.subscribe((data) => {
      switch (data.type) {
        case "ChannelMessage":
          this.addMessage(data)
          break;
      }
    })
  }
  fileOrBlobToDataURL(obj, cb) {
    var a = new FileReader()
    a.readAsDataURL(obj)
    a.onload = function (e) {
      cb(e.target.result)
    }
  }

  blobToImage(blob, cb) {
    this.fileOrBlobToDataURL(blob, function (dataurl) {
      var img = new Image()
      img.src = dataurl
      cb(dataurl)
    })
  }

  call(data) {
    // console.log(data)
    data.style.width = "300px"
    data.style.height = "200px"
    document.getElementById('img').append(data)
    // this.image.push(data)
  }


  addMessage(data) {
    // alert("Msg Recieved")

    if (data.msg.messageType == "TEXT") {
      this.message.push(
        {
          message: data.msg.text,
          memberId: data.memberId
        }
      )
      console.log(this.message, "array")
    }
    else if (data.msg.messageType == "IMAGE") {
      console.log(data, "raja")
      this.blobToImage(data.blob, (data) => {
        this.message.push({ isg: data, id: data.memberId })
      })
    }
  }

  onChat() {
    this.chatBtn = !this.chatBtn;
    this.usersDetail = !this.usersDetail
  }

  onChange(event) {
    this.files = event.target.files[0];
    console.log(this.files, "file");
    this.flag = true
  }

  onSubmit(data: NgForm) {
    let userId;
    this.route.params.subscribe(param => {
      userId = param.userId
    })
    this.message.push({ message: data.value.message, memberId: userId, self: true })


    console.log(data.value, "I am data")
    this.agoraRTM.sendChannelMessage(data.value)
    data.reset()

  }

  onSubmitImage() {
    this.message.push({ message: "Image Shared", memberId: this.userId, self: true });
    this.agoraRTM.sendChannelMessage({ message: "Image Shared" });
    this.agoraRTM.sendImage(this.files);
  }



}
