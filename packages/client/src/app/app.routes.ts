import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StudentsTableComponent } from './students-table/students-table.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'students', component: StudentsTableComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
