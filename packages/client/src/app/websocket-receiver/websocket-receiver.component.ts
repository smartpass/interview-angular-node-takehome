import { AsyncPipe, JsonPipe } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'

import { LiveConnectionService } from '../live-connection.service'

@Component({
  selector: 'app-websocket-receiver',
  standalone: true,
  imports: [FormsModule, JsonPipe, AsyncPipe],
  templateUrl: './websocket-receiver.component.html',
  styleUrl: './websocket-receiver.component.scss',
})
export class WebsocketReceiverComponent implements OnInit {
  messages$

  @ViewChild(NgForm, { static: true }) ngForm?: NgForm

  formModel = { message: 'foo' }

  constructor(private liveConnectionService: LiveConnectionService) {
    this.messages$ = this.liveConnectionService.listenForMessages()
  }

  ngOnInit() {
    this.ngForm?.form.valueChanges.subscribe((args) => {
      this.liveConnectionService.sendMessage({ op: 'echo', data: args.message })
    })
  }
}
