import { Routes } from '@angular/router';
import { VetListComponent } from './vet-list/vet-list.component';
import { VetAddComponent } from './vet-add/vet-add.component';
import { VetEditComponent } from './vet-edit/vet-edit.component';
import { vetResolver } from './vet-resolver';
import { specResolver } from '../specialties/spec-resolver';

export const VET_ROUTES: Routes = [
  { path: '', component: VetListComponent },
  { path: 'add', component: VetAddComponent },
  { path: ':id/edit', component: VetEditComponent, resolve: { vet: vetResolver, specs: specResolver } },
];
