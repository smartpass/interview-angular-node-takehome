import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketReceiverComponent } from './websocket-receiver/websocket-receiver.component';
import { StudentListComponent } from './student-list/student-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StudentListComponent, WebsocketReceiverComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
