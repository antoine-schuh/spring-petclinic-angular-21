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

import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Pet } from '../pet';
import { PetService } from '../pet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Owner } from '../../owners/owner';
import { PetType } from '../../pettypes/pettype';
import { PetTypeService } from '../../pettypes/pettype.service';

import { format } from 'date-fns';
import { OwnerService } from '../../owners/owner.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepicker,
} from '@angular/material/datepicker';

@Component({
  selector: 'app-pet-edit',
  templateUrl: './pet-edit.component.html',
  styleUrls: ['./pet-edit.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
  ],
})
export class PetEditComponent {
  private petService = inject(PetService);
  private petTypeService = inject(PetTypeService);
  private ownerService = inject(OwnerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  private petId = +this.route.snapshot.params.id;

  private petTypesResource = rxResource<PetType[], void>({
    stream: () => this.petTypeService.getPetTypes(),
  });
  petTypes = computed(() => this.petTypesResource.value() ?? []);

  private petResource = rxResource<Pet, void>({
    stream: () => this.petService.getPetById(this.petId),
  });

  private ownerResource = rxResource<Owner, number>({
    params: () => this.petResource.value()?.ownerId,
    stream: ({ params: ownerId }) => this.ownerService.getOwnerById(ownerId),
  });

  pet = linkedSignal<Pet>(() => this.petResource.value() ?? ({} as Pet));
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

  constructor() {
    effect(() => {
      const err = this.petResource.error() ?? this.petTypesResource.error() ?? this.ownerResource.error();
      if (err) this.errorMessage.set(String(err));
    });
    effect(() => {
      const p = this.pet();
      if (p.id) {
        this.form.patchValue({
          name:      p.name,
          birthDate: p.birthDate ? new Date(p.birthDate) : null,
          type:      p.type?.id ?? null,
        });
      }
    });
  }

  onSubmit() {
    const fv = this.form.value;
    const pet = {
      ...this.pet(),
      name:      fv.name,
      birthDate: format(new Date(fv.birthDate!), 'yyyy-MM-dd'),
      type:      this.petTypes().find(t => t.id === Number(fv.type)) ?? this.pet().type,
    } as Pet;
    this.petService.updatePet(pet.id.toString(), pet).subscribe({
      next: () => this.gotoOwnerDetail(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnerDetail() {
    this.router.navigate(['/owners', this.currentOwner().id]);
  }
}
