import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Mensaje } from '../model/mensaje';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  mensajes: Subject<Mensaje> = new Subject<Mensaje>();
  constructor() {
    this.socket = new WebSocket('ws://localhost:8080/my-websocket-endpoint');
    this.socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened');
    });
    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed');
    });
  }

  sendMessage(message: Mensaje) {
    if (this.socket.readyState === WebSocket.OPEN) {
      const json = JSON.stringify(message);
      this.socket.send(json);
    } else {
      console.log('WebSocket connection');
    }
  }
}