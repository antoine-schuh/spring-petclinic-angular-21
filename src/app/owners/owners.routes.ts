import { Routes } from '@angular/router';
import { OwnerListComponent } from './owner-list/owner-list.component';
import { OwnerAddComponent } from './owner-add/owner-add.component';
import { OwnerDetailComponent } from './owner-detail/owner-detail.component';
import { OwnerEditComponent } from './owner-edit/owner-edit.component';
import { PetAddComponent } from '../pets/pet-add/pet-add.component';

export const OWNER_ROUTES: Routes = [
  { path: '', component: OwnerListComponent },
  { path: 'add', component: OwnerAddComponent },
  { path: ':id', component: OwnerDetailComponent },
  { path: ':id/edit', component: OwnerEditComponent },
  { path: ':id/pets/add', component: PetAddComponent },
];
