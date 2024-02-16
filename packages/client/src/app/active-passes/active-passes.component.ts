import { AsyncPipe, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DateTime } from 'luxon';
import { catchError, concat, distinct, endWith, map, of as observableOf, share, shareReplay, switchMap, takeWhile, tap, throwError, timer } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

@Component({
  selector: 'app-active-passes',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    NgForOf,
    ],
  templateUrl: './active-passes.component.html',
  styleUrl: './active-passes.component.scss'
})
export class ActivePassesComponent {
  passes$

  passComparator = (_index: number, item: any) => item.id

  constructor() {
    this.passes$ = timer(0, 5000)
    .pipe(
      switchMap(() => fromFetch('http://localhost:3000/active-passes')),
      switchMap((response) => {
        if (response.ok) {
          return response.json() as Promise<object & {id: number, startTime: string, durationMinutes: number}[]>
        } else {
          return throwError(() => ({error: true, message: `Error: ${response.status} ${response.statusText}`}))
        }
      }),
      distinct((passes) => passes.map(({id}) => id).join(',')),
      map((passes) =>
        passes
          .map((pass) => {
          const remaining$ = timer(0, 1000).pipe(
            map(() =>
              DateTime.fromISO(pass.startTime).plus({minutes: pass.durationMinutes}).diffNow()),
            takeWhile((duration) => duration.toMillis() > 0),
            share()
            )

          return {
            ...pass,
            remainingDuration$: remaining$.pipe(map((duration) => duration.toFormat('mm:ss')), endWith('Expired')),
            remainingPercent$: remaining$.pipe(
              map((duration) => (100 - (100 * (duration.as('seconds') / (pass.durationMinutes * 60)))).toPrecision(2)),
              endWith(100),
              ),
          } as any
        })),
      catchError(error => {
        return throwError(() => ({error: true, message: error.message}))
      }))

  }
}
