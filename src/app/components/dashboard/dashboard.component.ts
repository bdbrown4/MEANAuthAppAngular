import { AfterViewChecked, ElementRef, ViewChild, Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked  {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chats: Array<any>;
  user: {
    name:string,
    email:string,
    username:string,
    password:string
  };
  textInput: string = '';

  constructor(private authService:AuthService,
              private chatService: ChatService, 
              private router: Router, 
              private socketService: SocketService) { }

  ngOnInit() {
    this.scrollToBottom();
    this.chats = new Array();
    this.socketService.on('message-received', (chat) =>{
      this.chats.push(chat);
    })

    //getting chats
    this.chatService.getChatInfo().subscribe(_chats => {
      this.chats = _chats.reverse();
    },
    err => {
    console.log(err);
    return false;
    });
    //getting user info
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
    console.log(err);
    return false;
    });
  }

  ngAfterViewChecked() {        
      this.scrollToBottom();        
  } 

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }                 
  }

  sendMessage(){
    let name = this.user.name;
    let username = this.user.username;
    let message = this.textInput;
    let chat = {
      name: name,
      username: username,
      message: message
    };
    this.chatService.sendChatMessage(name,username,message).subscribe();
    this.socketService.emit('send-message',chat);
    this.textInput='';
  }

}
