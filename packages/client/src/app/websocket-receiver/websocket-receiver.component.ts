import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm } from '@angular/forms';
import { Observable, catchError, concatMap, delay, identity, map, take, timer } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket'

@Component({
  selector: 'app-websocket-receiver',
  standalone: true,
  imports: [FormsModule, JsonPipe, AsyncPipe],
  templateUrl: './websocket-receiver.component.html',
  styleUrl: './websocket-receiver.component.scss'
})
export class WebsocketReceiverComponent {
  websocket$

  messages$

  @ViewChild(NgForm, {static: true}) ngForm?: NgForm

  formModel = {message: 'foo'}

  constructor() {
    this.websocket$ = webSocket('ws://localhost:3000')

    this.messages$ = this.websocket$
      .pipe(
        catchError((err, caught) => {
          console.log('error', err)
          console.log('caught', caught)
          return timer(500).pipe(concatMap(() => caught))
        })
      )

    this.websocket$.next({op: 'noop', data: 'hello from client!'})
  }

  ngOnInit() {
    console.log('form', this.ngForm)

    this.ngForm?.form.valueChanges.subscribe((args) => {
      console.log('value changes', args)
      this.websocket$.next({op: 'echo', data: args.message})
    })
  }
}
