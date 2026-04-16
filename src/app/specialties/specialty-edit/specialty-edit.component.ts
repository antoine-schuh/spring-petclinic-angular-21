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
import { Specialty } from '../specialty';
import { SpecialtyService } from '../specialty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-specialty-edit',
  templateUrl: './specialty-edit.component.html',
  styleUrls: ['./specialty-edit.component.css'],
  imports: [ReactiveFormsModule],
})
export class SpecialtyEditComponent {
  private specialtyService = inject(SpecialtyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private specId = this.route.snapshot.params.id;

  private specialtyResource = rxResource<Specialty, void>({
    stream: () => this.specialtyService.getSpecialtyById(this.specId),
  });

  specialty = linkedSignal<Specialty>(() => this.specialtyResource.value() ?? ({} as Specialty));
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
      const s = this.specialty();
      if (s.id) this.form.patchValue({ name: s.name });
    });
  }

  onSubmit() {
    const specialty: Specialty = { id: this.specialty().id, name: this.form.value.name! };
    this.specialtyService.updateSpecialty(specialty.id.toString(), specialty).subscribe({
      next: () => this.onBack(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  onBack() {
    this.router.navigate(['/specialties']);
  }
}
