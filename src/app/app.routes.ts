import { Routes } from '@angular/router';
import { WelcomeComponent } from './parts/welcome/welcome.component';
import { PageNotFoundComponent } from './parts/page-not-found/page-not-found.component';

export const appRoutes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', component: WelcomeComponent },
  {
    path: 'owners',
    loadChildren: () => import('./owners/owners.routes').then(m => m.OWNER_ROUTES),
  },
  {
    path: 'pets',
    loadChildren: () => import('./pets/pets.routes').then(m => m.PET_ROUTES),
  },
  {
    path: 'visits',
    loadChildren: () => import('./visits/visits.routes').then(m => m.VISIT_ROUTES),
  },
  {
    path: 'vets',
    loadChildren: () => import('./vets/vets.routes').then(m => m.VET_ROUTES),
  },
  {
    path: 'pettypes',
    loadChildren: () => import('./pettypes/pettypes.routes').then(m => m.PETTYPE_ROUTES),
  },
  {
    path: 'specialties',
    loadChildren: () => import('./specialties/specialties.routes').then(m => m.SPECIALTY_ROUTES),
  },
  { path: '**', component: PageNotFoundComponent },
];
