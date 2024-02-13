import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StudentListComponent } from '../student-list/student-list.component';
import { WebsocketReceiverComponent } from '../websocket-receiver/websocket-receiver.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    StudentListComponent,
    WebsocketReceiverComponent,
    MatSlideToggleModule,
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'client';
}
