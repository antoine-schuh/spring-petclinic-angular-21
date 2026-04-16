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

import { Component, computed, effect, inject, signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Visit } from '../visit';
import { VisitService } from '../visit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../pets/pet.service';
import { Pet } from '../../pets/pet';
import { PetType } from '../../pettypes/pettype';
import { Owner } from '../../owners/owner';

import { format } from 'date-fns';
import { OwnerService } from '../../owners/owner.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepicker,
} from '@angular/material/datepicker';
import { VisitListComponent } from '../visit-list/visit-list.component';

@Component({
  selector: 'app-visit-add',
  templateUrl: './visit-add.component.html',
  styleUrls: ['./visit-add.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    VisitListComponent,
  ],
})
export class VisitAddComponent {
  private visitService = inject(VisitService);
  private petService = inject(PetService);
  private ownerService = inject(OwnerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  private petId = +this.route.snapshot.params.id;

  private petResource = rxResource<Pet, void>({
    stream: () => this.petService.getPetById(this.petId),
  });

  private ownerResource = rxResource<Owner, number>({
    params: () => this.petResource.value()?.ownerId,
    stream: ({ params: ownerId }) => this.ownerService.getOwnerById(ownerId),
  });

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
      const err = this.petResource.error() ?? this.ownerResource.error();
      if (err) this.errorMessage.set(String(err));
    });
  }

  onSubmit() {
    const fv = this.form.value;
    const visit = {
      id: null,
      date: format(new Date(fv.date!), 'yyyy-MM-dd'),
      description: fv.description,
      pet: this.currentPet(),
    } as unknown as Visit;
    this.visitService.addVisit(visit).subscribe({
      next: () => this.gotoOwnerDetail(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnerDetail() {
    this.router.navigate(['/owners', this.currentOwner().id]);
  }
}
