import { Routes } from '@angular/router';
import { SpecialtyListComponent } from './specialty-list/specialty-list.component';
import { SpecialtyEditComponent } from './specialty-edit/specialty-edit.component';

export const SPECIALTY_ROUTES: Routes = [
  { path: '', component: SpecialtyListComponent },
  { path: ':id/edit', component: SpecialtyEditComponent },
];
