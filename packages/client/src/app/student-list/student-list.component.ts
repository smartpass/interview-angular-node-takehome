import { AsyncPipe, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { catchError, of, switchMap, timer } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [AsyncPipe, NgForOf],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
  students$

  constructor() {
    this.students$ = timer(0, 5000)
    .pipe(
      switchMap(() => fromFetch('http://localhost:3000/students')),
      switchMap((response) => {
        if (response.ok) {
          return response.json()
        } else {
          return of({error: true, message: `Error: ${response.status} ${response.statusText}`})
        }
      }),
      catchError(error => {
        return of({error: true, message: error.message})
      }))
  }

  ngOnInit() {

  }
}
