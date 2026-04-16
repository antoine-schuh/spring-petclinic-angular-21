import { Routes } from '@angular/router';
import { VisitListComponent } from './visit-list/visit-list.component';
import { VisitAddComponent } from './visit-add/visit-add.component';
import { VisitEditComponent } from './visit-edit/visit-edit.component';

export const VISIT_ROUTES: Routes = [
  { path: '', component: VisitListComponent },
  { path: 'add', component: VisitAddComponent },
  { path: ':id/edit', component: VisitEditComponent },
];
