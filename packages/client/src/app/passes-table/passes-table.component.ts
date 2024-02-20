import { AsyncPipe } from '@angular/common'
import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTable, MatTableModule } from '@angular/material/table'
import { DateTime } from 'luxon'

import {
  PassesTableDataSource,
  PassesTableItem,
} from './passes-table-datasource'

@Component({
  selector: 'app-passes-table',
  templateUrl: './passes-table.component.html',
  styleUrl: './passes-table.component.scss',
  standalone: true,
  imports: [AsyncPipe, MatTableModule, MatPaginatorModule, MatSortModule],
})
export class PassesTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatTable) table!: MatTable<PassesTableItem>
  dataSource = new PassesTableDataSource()

  timeFormat = DateTime.DATETIME_FULL

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'sourceId',
    'destinationId',
    'startTime',
    'durationMinutes',
    'endTime',
  ]

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.table.dataSource = this.dataSource
  }
}
