import { AsyncPipe } from '@angular/common'
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTable, MatTableModule } from '@angular/material/table'

import {
  StudentsTableDataSource,
  StudentsTableItem,
} from './students-table-datasource'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrl: './students-table.component.scss',
  standalone: true,
  imports: [AsyncPipe, MatTableModule, MatPaginatorModule, MatSortModule],
})
export class StudentsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatTable) table!: MatTable<StudentsTableItem>
  dataSource = new StudentsTableDataSource()

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name']

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({students}) => {
      this.dataSource.students$ = of(students);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.table.dataSource = this.dataSource
  }
}
