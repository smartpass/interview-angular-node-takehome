import { ResolveFn, Routes } from '@angular/router'

import { ActivePassesComponent } from './active-passes/active-passes.component'
import { LocationsTableComponent } from './locations-table/locations-table.component'
import { PassesTableComponent } from './passes-table/passes-table.component'
import { StudentsTableComponent } from './students-table/students-table.component'
import { fromFetch } from 'rxjs/fetch'
import { formatUrl } from '@smartpass/angular-node-takehome-common/src/utils'
import { Students } from '@smartpass/angular-node-takehome-common'
import { switchMap, throwError } from 'rxjs'

//Prefetching the data to mediate long load times, probably in the future would move this to its own file to keep the fetching logic out of router
export const studentResolver: ResolveFn<any> = () => {
  return fromFetch(formatUrl('http://localhost:3000/students')).pipe(
    switchMap((response: any) => {
      if (response.ok) {
        return response.json() as Promise<Students.Retrieve[]>
      } else {
        return throwError(
          () => new Error(`Error: ${response.status} ${response.statusText}`),
        )
      }
    })
  )
};

export const routes: Routes = [
  { path: 'students', component: StudentsTableComponent,  resolve: {students: studentResolver} },
  { path: 'locations', component: LocationsTableComponent },
  { path: 'passes', component: PassesTableComponent },
  { path: 'active-passes', component: ActivePassesComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'active-passes' },
]
