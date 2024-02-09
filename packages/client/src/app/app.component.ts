import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketReceiverComponent } from './websocket-receiver/websocket-receiver.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WebsocketReceiverComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
