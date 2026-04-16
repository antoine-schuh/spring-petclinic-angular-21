import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SpecialtyService } from './specialty.service';
import { Specialty } from './specialty';

export const specResolver: ResolveFn<Specialty[]> = () => {
  return inject(SpecialtyService).getSpecialties();
};
