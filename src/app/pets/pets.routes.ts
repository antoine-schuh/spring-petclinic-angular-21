import { Routes } from '@angular/router';
import { PetListComponent } from './pet-list/pet-list.component';
import { PetAddComponent } from './pet-add/pet-add.component';
import { PetEditComponent } from './pet-edit/pet-edit.component';
import { VisitAddComponent } from '../visits/visit-add/visit-add.component';

export const PET_ROUTES: Routes = [
  { path: '', component: PetListComponent },
  { path: 'add', component: PetAddComponent },
  {
    path: ':id',
    children: [
      { path: 'edit', component: PetEditComponent },
      { path: 'visits/add', component: VisitAddComponent },
    ],
  },
];
