import { AsyncPipe, NgForOf } from '@angular/common'
import { Component } from '@angular/core'
import { of } from 'rxjs'

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [AsyncPipe, NgForOf],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
})
export class StudentListComponent {
  students$

  constructor() {
    this.students$ = of<{ name: string }[]>([])
  }
}
