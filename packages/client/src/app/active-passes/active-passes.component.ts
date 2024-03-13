import { AsyncPipe, CommonModule, NgForOf } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSnackBar } from '@angular/material/snack-bar'
import { DateTime } from 'luxon'
import {
  Observable,
  catchError,
  distinct,
  endWith,
  filter,
  map,
  of,
  share,
  switchMap,
  takeWhile,
  tap,
  throwError,
  timer,
} from 'rxjs'
import { fromFetch } from 'rxjs/fetch'

import {
  Locations,
  Passes,
  Students,
} from '@smartpass/angular-node-takehome-common'
import { EventMessage } from '@smartpass/angular-node-takehome-common/src/messages'
import { formatUrl } from '@smartpass/angular-node-takehome-common/src/utils'

import { LiveConnectionService } from '../live-connection.service'

type ActivePassesResponse = Pick<
  Passes.Retrieve,
  'id' | 'startTime' | 'durationMinutes' | 'endTime'
> & {
  student: Students.Retrieve
  source: Locations.Retrieve
  destination: Locations.Retrieve
}

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
  styleUrl: './active-passes.component.scss',
})
export class ActivePassesComponent implements OnDestroy {
  passes$;

  private passUpdatesSubscription;

  passComparator = (_index: number, item: ActivePassesResponse | undefined) => item?.id

  constructor(
    private liveConnectionService: LiveConnectionService,
    private snackBar: MatSnackBar,
  ) {
    this.passes$ = this.getPasses();
    this.passUpdatesSubscription = this.liveConnectionService
      .listenForMessages(
        ({ op, data }) => op === 'event' && data.event.startsWith('pass'),
      )
      .pipe(
        map(
          (message) =>
            (message as EventMessage).data['pass'] as
              | Passes.Retrieve
              | undefined,
        ),
        filter(Boolean),
        tap(() => this.passes$ = this.getPasses())
      )
      .subscribe((pass) => {
        if (pass.endTime) {
          this.snackBar.open(`pass ${pass.id}  ended`, undefined, {
            duration: 5000,
          })
        } else {
          this.snackBar.open(`pass ${pass.id} started`, undefined, {
            duration: 5000,
          })
        }
      });
  }

  ngOnDestroy(): void {
    this.passUpdatesSubscription.unsubscribe()
  }

  // Ideally would not want to return any, but due to the async pipe being mapped to the object it created an interesting return object that I would look to refactor
  getPasses(): any {
    return fromFetch(formatUrl('http://localhost:3000/active-passes')).pipe(
      switchMap((response) => {
        if (response.ok) {
          return response.json() as Promise<ActivePassesResponse[]>
        } else {
          return throwError(() => ({
            error: true,
            message: `Error: ${response.status} ${response.statusText}`,
          }))
        }
      }),
      distinct((passes) => passes.map(({ id }) => id).join(',')),
      map((passes) =>
        passes.map((pass) => {
          const remaining$ = timer(0, 1000).pipe(
            map(() =>
              DateTime.fromISO(pass.startTime)
                .plus({ minutes: pass.durationMinutes })
                .diffNow(),
            ),
            takeWhile((duration) => duration.toMillis() > 0),
            share(),
          )

          return {
            ...pass,
            remainingDuration$: remaining$.pipe(
              map((duration) => duration.toFormat('mm:ss')),
              endWith('Expired'),
            ),
            remainingPercent$: remaining$.pipe(
              map((duration) =>
                (
                  100 -
                  100 * (duration.as('seconds') / (pass.durationMinutes * 60))
                ).toPrecision(2),
              ),
              endWith(100),
            ),
          }
        }),
      ),
      catchError((error) => {
        return throwError(() => ({ error: true, message: error.message }))
      }),
    )
  }
}
