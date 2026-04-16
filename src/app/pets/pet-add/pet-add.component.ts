/*
 *
 *  * Copyright 2016-2017 the original author or authors.
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
import { provideNativeDateAdapter } from '@angular/material/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Pet } from '../pet';
import { PetType } from '../../pettypes/pettype';
import { Owner } from '../../owners/owner';
import { ActivatedRoute, Router } from '@angular/router';
import { PetTypeService } from '../../pettypes/pettype.service';
import { PetService } from '../pet.service';
import { OwnerService } from '../../owners/owner.service';

import { format } from 'date-fns';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepicker,
} from '@angular/material/datepicker';

@Component({
  selector: 'app-pet-add',
  templateUrl: './pet-add.component.html',
  styleUrls: ['./pet-add.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
  ],
})
export class PetAddComponent {
  private ownerService = inject(OwnerService);
  private petService = inject(PetService);
  private petTypeService = inject(PetTypeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  private ownerId = this.route.snapshot.params.id;

  private petTypesResource = rxResource<PetType[], void>({
    stream: () => this.petTypeService.getPetTypes(),
  });
  petTypes = computed(() => this.petTypesResource.value() ?? []);

  private ownerResource = rxResource<Owner, void>({
    stream: () => this.ownerService.getOwnerById(this.ownerId),
  });
  currentOwner = computed(() => this.ownerResource.value() ?? ({} as Owner));

  errorMessage = signal('');

  nameCtrl      = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern('^[A-Za-z0-9].{0,29}$')]);
  birthDateCtrl = new FormControl<Date | null>(null, [Validators.required]);
  typeCtrl      = new FormControl<number | null>(null, [Validators.required]);

  form = this.fb.group({
    name:      this.nameCtrl,
    birthDate: this.birthDateCtrl,
    type:      this.typeCtrl,
  });

  onSubmit() {
    const fv = this.form.value;
    const pet = {
      id: null,
      name: fv.name,
      birthDate: format(new Date(fv.birthDate!), 'yyyy-MM-dd'),
      type: this.petTypes().find(t => t.id === Number(fv.type)),
      owner: this.currentOwner(),
    } as unknown as Pet;
    this.petService.addPet(pet).subscribe({
      next: () => this.gotoOwnerDetail(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnerDetail() {
    this.router.navigate(['/owners', this.currentOwner().id]);
  }
}
