import { DataSource } from '@angular/cdk/collections'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { Observable, Subject, combineLatest, throwError, timer } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { startWith, switchMap } from 'rxjs/operators'

import { GetStudentsResponse } from '@smartpass/angular-node-takehome-common/src/students'
import { formatUrl } from '@smartpass/angular-node-takehome-common/src/utils'

export interface StudentsTableItem {
  name: string
  id: number
}

/**
 * Data source for the StudentsTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class StudentsTableDataSource extends DataSource<StudentsTableItem> {
  paginator: MatPaginator | undefined
  sort: MatSort | undefined

  length$: Subject<number> = new Subject() // updated when the api response returns

  constructor() {
    super()
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<StudentsTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return combineLatest([
        timer(0, 5000),
        this.paginator.page.pipe(
          startWith({
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            length: this.paginator.length,
          }),
        ),
        this.sort.sortChange.pipe(
          startWith({
            active: this.sort.active,
            direction: this.sort.direction,
          }),
        ),
      ]).pipe(
        switchMap(() => {
          if (this.paginator) {
            const startIndex =
              this.paginator.pageIndex * this.paginator.pageSize
            // todo: probably should cache this data so we don't make duplicate network requests when navigating back to pages we've already been
            return fromFetch(
              formatUrl('http://localhost:3000/students', {
                offset: startIndex,
                limit: this.paginator.pageSize,
                // added this at the last minute, hope it's not broken :)
                sort: {
                  column: this.sort?.active || 'id',
                  direction: this.sort?.direction || 'asc',
                },
              }),
            )
          } else {
            return throwError(() => new Error(`paginator is ${this.paginator}`))
          }
        }),
        switchMap((response) => {
          if (response.ok) {
            return response.json().then((resJson) => {
              const { count, objects } = resJson as GetStudentsResponse // todo: use validation like zod here before casting
              // this feels like it goes against the rx patterns. There's probably a better way to update multiple values at once
              this.length$.next(count)
              return objects
            })
          } else {
            return throwError(
              () =>
                new Error(`Error: ${response.status} ${response.statusText}`),
            )
          }
        }),
      )
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.',
      )
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}
}
