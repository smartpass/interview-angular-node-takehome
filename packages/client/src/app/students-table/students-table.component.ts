import { AsyncPipe } from '@angular/common'
import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTable, MatTableModule } from '@angular/material/table'

import {
  StudentsTableDataSource,
  StudentsTableItem,
} from './students-table-datasource'

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrl: './students-table.component.scss',
  standalone: true,
  imports: [AsyncPipe, MatTableModule, MatPaginatorModule, MatSortModule],
})
export class StudentsTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatTable) table!: MatTable<StudentsTableItem>
  dataSource = new StudentsTableDataSource()

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name']

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.table.dataSource = this.dataSource
  }
}
