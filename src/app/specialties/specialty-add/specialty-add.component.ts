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

import { Component, inject, output, signal } from '@angular/core';
import { Specialty } from '../specialty';
import { SpecialtyService } from '../specialty.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-specialty-add',
  templateUrl: './specialty-add.component.html',
  styleUrls: ['./specialty-add.component.css'],
  imports: [ReactiveFormsModule],
})
export class SpecialtyAddComponent {
  private specialtyService = inject(SpecialtyService);
  private fb = inject(FormBuilder);

  errorMessage = signal('');
  newSpeciality = output<Specialty>();

  nameCtrl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(80),
    Validators.pattern('^[A-Za-z0-9].{0,79}$'),
  ]);

  form = this.fb.group({
    name: this.nameCtrl,
  });

  onSubmit() {
    const specialty = { id: null, name: this.form.value.name } as unknown as Specialty;
    this.specialtyService.addSpecialty(specialty).subscribe({
      next: (newSpecialty) => {
        this.newSpeciality.emit(newSpecialty);
        this.form.reset();
      },
      error: (error) => this.errorMessage.set(error as any),
    });
  }
}
