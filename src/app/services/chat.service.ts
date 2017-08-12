import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {

  constructor(private http:Http) {
  }

  getChatInfo(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/chats/getInfo',{headers:headers})
      .map(res => res.json());
  }

  sendChatMessage(nameObj:string, usernameObj:string, messageObj:string){
    let headers = new Headers();
    let chat = {
      name: nameObj,
      username: usernameObj,
      message: messageObj
    }
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/chats/postChat', chat, {headers:headers})
      .map(res => res.json());
  }
}
