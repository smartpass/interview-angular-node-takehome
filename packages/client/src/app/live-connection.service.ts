import { Injectable } from '@angular/core';
import { Messages } from '@smartpass/angular-node-takehome-common';
import { catchError, concatMap, timer } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class LiveConnectionService {
  private websocket$

  messages$

  constructor() {
    this.websocket$ = webSocket<Messages.ServerMessage>('ws://localhost:3000')

    this.messages$ = this.websocket$
      .pipe(
        catchError((err, caught) => {
          console.debug('websocket error', err)
          console.debug('restarting connection in 500ms...')
          return timer(500).pipe(concatMap(() => caught))
        })
      )
  }

  sendMessage(message: Messages.ClientMessage) {
    // cast because websocket defines a single type for sending and recieving
    this.websocket$.next(message as Messages.ServerMessage)
  }

  listenForMessages(filter: Parameters<typeof this.websocket$['multiplex']>[2] = () => true) {
    return this.websocket$.multiplex(
      () => ({op: 'noop', data: 'hello from client!'}),
      () => ({op: 'noop', data: 'bye from client!'}),
      filter)
  }
}
