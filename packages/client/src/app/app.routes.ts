import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StudentsTableComponent } from './students-table/students-table.component';
import { LocationsTableComponent } from './locations-table/locations-table.component';
import { PassesTableComponent } from './passes-table/passes-table.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'students', component: StudentsTableComponent },
  { path: 'locations', component: LocationsTableComponent },
  { path: 'passes', component: PassesTableComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
