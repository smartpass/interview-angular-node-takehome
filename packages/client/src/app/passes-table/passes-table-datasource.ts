import { DataSource } from '@angular/cdk/collections'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { DateTime } from 'luxon'
import { Observable, combineLatest, throwError, timer } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { map, share, startWith, switchMap } from 'rxjs/operators'

import { Passes } from '@smartpass/angular-node-takehome-common'
import { formatUrl } from '@smartpass/angular-node-takehome-common/src/utils'

export interface PassesTableItem {
  id: number
  sourceId: number
  destinationId: number
  startTime: DateTime
  durationMinutes: number
  endTime?: DateTime
}

/**
 * Data source for the PassesTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class PassesTableDataSource extends DataSource<PassesTableItem> {
  paginator: MatPaginator | undefined
  sort: MatSort | undefined

  private passes$ = timer(0, 5000).pipe(
    switchMap(() => fromFetch(formatUrl('http://localhost:3000/passes'))),
    switchMap((response) => {
      if (response.ok) {
        return response.json().then((passes: Passes.Retrieve[]) =>
          passes.map((pass) => ({
            ...pass,
            startTime: DateTime.fromISO(pass.startTime),
            endTime: pass.endTime ? DateTime.fromISO(pass.endTime) : undefined,
          })),
        )
      } else {
        return throwError(
          () => new Error(`Error: ${response.status} ${response.statusText}`),
        )
      }
    }),
    // catchError(error => {
    //   return observableOf({error: true, message: error.message})
    // })
    share(),
  )

  length$: Observable<number> = this.passes$.pipe(map((ps) => ps.length))

  constructor() {
    super()
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<PassesTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return combineLatest([
        this.passes$,
        this.paginator.page.pipe(
          startWith({
            pageIndex: 0,
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
        map(([passes, _page, _sort]) => {
          return this.getPagedData(this.getSortedData(passes))
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

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: PassesTableItem[]): PassesTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize
      return data.splice(startIndex, this.paginator.pageSize)
    } else {
      return data
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: PassesTableItem[]): PassesTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc'
      switch (this.sort?.active) {
        case 'id':
          return compare(+a.id, +b.id, isAsc)
        case 'sourceId':
          return compare(+a.sourceId, +b.sourceId, isAsc)
        case 'destinationId':
          return compare(+a.destinationId, +b.destinationId, isAsc)
        case 'startTime':
          return compare(
            a.startTime.toUnixInteger(),
            b.startTime.toUnixInteger(),
            isAsc,
          )
        case 'endTime':
          return compare(
            a.endTime?.toUnixInteger() ?? 0,
            b.endTime?.toUnixInteger() ?? 0,
            isAsc,
          )
        default:
          return 0
      }
    })
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean,
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
}
