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
import { Visit } from '../visit';
import { Pet } from '../../pets/pet';
import { Owner } from '../../owners/owner';
import { PetType } from '../../pettypes/pettype';
import { VisitService } from '../visit.service';
import { ActivatedRoute, Router } from '@angular/router';

import { format } from 'date-fns';
import { OwnerService } from '../../owners/owner.service';
import { PetService } from '../../pets/pet.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepicker,
} from '@angular/material/datepicker';

@Component({
  selector: 'app-visit-edit',
  templateUrl: './visit-edit.component.html',
  styleUrls: ['./visit-edit.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
  ],
})
export class VisitEditComponent {
  private visitService = inject(VisitService);
  private petService = inject(PetService);
  private ownerService = inject(OwnerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private visitId = this.route.snapshot.params.id as string;

  private visitResource = rxResource<Visit, void>({
    stream: () => this.visitService.getVisitById(this.visitId),
  });

  private petResource = rxResource<Pet, number>({
    params: () => this.visitResource.value()?.petId,
    stream: ({ params: petId }) => this.petService.getPetById(petId),
  });

  private ownerResource = rxResource<Owner, number>({
    params: () => this.petResource.value()?.ownerId,
    stream: ({ params: ownerId }) => this.ownerService.getOwnerById(ownerId),
  });

  visit = linkedSignal<Visit>(() => this.visitResource.value() ?? ({} as Visit));
  currentPet = computed(() => this.petResource.value() ?? ({} as Pet));
  currentOwner = computed(() => this.ownerResource.value() ?? ({} as Owner));
  currentPetType = computed(() => this.petResource.value()?.type ?? ({} as PetType));
  errorMessage = signal('');

  dateCtrl        = new FormControl<Date | null>(null, [Validators.required]);
  descriptionCtrl = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]);

  form = this.fb.group({
    date:        this.dateCtrl,
    description: this.descriptionCtrl,
  });

  constructor() {
    effect(() => {
      const err = this.visitResource.error() ?? this.petResource.error() ?? this.ownerResource.error();
      if (err) this.errorMessage.set(String(err));
    });
    effect(() => {
      const v = this.visit();
      if (v.id) {
        this.form.patchValue({
          date:        v.date ? new Date(v.date) : null,
          description: v.description,
        });
      }
    });
  }

  onSubmit() {
    const fv = this.form.value;
    const visit = {
      ...this.visit(),
      date:        format(new Date(fv.date!), 'yyyy-MM-dd'),
      description: fv.description,
      pet:         this.currentPet(),
    } as Visit;
    this.visitService.updateVisit(visit.id.toString(), visit).subscribe({
      next: () => this.gotoOwnerDetail(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnerDetail() {
    this.router.navigate(['/owners', this.currentOwner().id]);
  }
}
