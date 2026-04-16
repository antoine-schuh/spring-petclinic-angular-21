/*
 *
 *  * Copyright 2016-2018 the original author or authors.
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *      http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

/**
 * @author Vitaliy Fedoriv
 */

import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Specialty } from '../../specialties/specialty';
import { SpecialtyService } from 'app/specialties/specialty.service';
import { Vet } from '../vet';
import { Router } from '@angular/router';
import { VetService } from '../vet.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatSelect, MatOption } from '@angular/material/select';

@Component({
  selector: 'app-vet-add',
  templateUrl: './vet-add.component.html',
  styleUrls: ['./vet-add.component.css'],
  imports: [ReactiveFormsModule, MatFormField, MatSelect, MatOption],
})
export class VetAddComponent {
  private specialtyService = inject(SpecialtyService);
  private vetService = inject(VetService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  specialtiesResource = rxResource<Specialty[], void>({
    stream: () => this.specialtyService.getSpecialties(),
  });

  specialtiesList = computed(() => this.specialtiesResource.value() ?? []);
  errorMessage = signal('');

  firstNameCtrl   = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern('^[a-zA-Z]*$')]);
  lastNameCtrl    = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern('^[a-zA-Z]*$')]);
  specialtiesCtrl = new FormControl<Specialty[]>([], []);

  form = this.fb.group({
    firstName:   this.firstNameCtrl,
    lastName:    this.lastNameCtrl,
    specialties: this.specialtiesCtrl,
  });

  compareSpecFn(c1: Specialty, c2: Specialty): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onSubmit() {
    const fv = this.form.value;
    const vet = {
      id: null,
      firstName:   fv.firstName,
      lastName:    fv.lastName,
      specialties: fv.specialties ?? [],
    } as unknown as Vet;
    this.vetService.addVet(vet).subscribe({
      next: () => this.gotoVetList(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoVetList() {
    this.router.navigate(['/vets']);
  }
}
