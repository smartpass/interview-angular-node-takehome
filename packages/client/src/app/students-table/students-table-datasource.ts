import { DataSource } from '@angular/cdk/collections'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { Observable, combineLatest, of, throwError, timer } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { map, share, startWith, switchMap } from 'rxjs/operators'

import { Students } from '@smartpass/angular-node-takehome-common'
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
  students$ = timer(0, 5000).pipe(
    switchMap(() => fromFetch(formatUrl('http://localhost:3000/students'))),
    switchMap((response) => {
      if (response.ok) {
        return response.json() as Promise<Students.Retrieve[]>
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

  length$: Observable<number> = this.students$.pipe(map((s) => s.length))

  constructor() {
    super();
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
      return combineLatest(
        this.students$,
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
      ).pipe(
        map(([students, _page, _sort]) => {
          return this.getPagedData(this.getSortedData([...students]))
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
  private getPagedData(data: StudentsTableItem[]): StudentsTableItem[] {
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
  private getSortedData(data: StudentsTableItem[]): StudentsTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc'
      switch (this.sort?.active) {
        case 'name':
          return compare(a.name, b.name, isAsc)
        case 'id':
          return compare(+a.id, +b.id, isAsc)
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
