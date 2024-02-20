import { Routes } from '@angular/router'

import { ActivePassesComponent } from './active-passes/active-passes.component'
import { LocationsTableComponent } from './locations-table/locations-table.component'
import { PassesTableComponent } from './passes-table/passes-table.component'
import { StudentsTableComponent } from './students-table/students-table.component'

export const routes: Routes = [
  { path: 'students', component: StudentsTableComponent },
  { path: 'locations', component: LocationsTableComponent },
  { path: 'passes', component: PassesTableComponent },
  { path: 'active-passes', component: ActivePassesComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'active-passes' },
]
