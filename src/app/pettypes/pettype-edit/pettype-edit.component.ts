/*
 *
 *  * Copyright 2017-2018 the original author or authors.
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

import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PetType } from '../pettype';
import { PetTypeService } from '../pettype.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pettype-edit',
  templateUrl: './pettype-edit.component.html',
  styleUrls: ['./pettype-edit.component.css'],
  imports: [ReactiveFormsModule],
})
export class PettypeEditComponent {
  private pettypeService = inject(PetTypeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private pettypeId = this.route.snapshot.params.id;

  private pettypeResource = rxResource<PetType, void>({
    stream: () => this.pettypeService.getPetTypeById(this.pettypeId),
  });

  pettype = linkedSignal<PetType>(() => this.pettypeResource.value() ?? ({} as PetType));
  errorMessage = signal('');

  nameCtrl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(80),
    Validators.pattern('^[A-Za-z0-9].{0,79}$'),
  ]);

  form = this.fb.group({
    name: this.nameCtrl,
  });

  constructor() {
    effect(() => {
      const p = this.pettype();
      if (p.id) this.form.patchValue({ name: p.name });
    });
  }

  onSubmit() {
    const pettype: PetType = { id: this.pettype().id, name: this.form.value.name! };
    this.pettypeService.updatePetType(pettype.id.toString(), pettype).subscribe({
      next: () => this.onBack(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  onBack() {
    this.router.navigate(['/pettypes']);
  }
}
