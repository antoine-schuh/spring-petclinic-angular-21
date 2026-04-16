import { Routes } from '@angular/router';
import { PettypeListComponent } from './pettype-list/pettype-list.component';
import { PettypeAddComponent } from './pettype-add/pettype-add.component';
import { PettypeEditComponent } from './pettype-edit/pettype-edit.component';

export const PETTYPE_ROUTES: Routes = [
  { path: '', component: PettypeListComponent },
  { path: 'add', component: PettypeAddComponent },
  { path: ':id/edit', component: PettypeEditComponent },
];
