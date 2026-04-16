import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VetService } from './vet.service';
import { Vet } from './vet';

export const vetResolver: ResolveFn<Vet> = (route) => {
  return inject(VetService).getVetById(route.paramMap.get('id'));
};
