import { AsyncPipe } from '@angular/common'
import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { MatIcon } from '@angular/material/icon'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTable, MatTableModule } from '@angular/material/table'

import {
  LocationsTableDataSource,
  LocationsTableItem,
} from './locations-table-datasource'

@Component({
  selector: 'app-locations-table',
  templateUrl: './locations-table.component.html',
  styleUrl: './locations-table.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatIcon,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class LocationsTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatTable) table!: MatTable<LocationsTableItem>
  dataSource = new LocationsTableDataSource()

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'icon', 'name']

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.table.dataSource = this.dataSource
  }
}
