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

import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Specialty } from '../specialty';
import { SpecialtyService } from '../specialty.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpecialtyAddComponent } from '../specialty-add/specialty-add.component';

@Component({
  selector: 'app-specialty-list',
  templateUrl: './specialty-list.component.html',
  styleUrls: ['./specialty-list.component.css'],
  imports: [FormsModule, SpecialtyAddComponent],
})
export class SpecialtyListComponent {
  private specService = inject(SpecialtyService);
  private router = inject(Router);

  specResource = rxResource<Specialty[], void>({
    stream: () => this.specService.getSpecialties(),
  });

  specialties = linkedSignal<Specialty[]>(() => this.specResource.value() ?? []);
  isSpecialitiesDataReceived = computed(() => !this.specResource.isLoading());
  errorMessage = '';
  responseStatus: number;
  isInsert = signal(false);

  deleteSpecialty(specialty: Specialty) {
    this.specService.deleteSpecialty(specialty.id.toString()).subscribe({
      next: (response) => {
        this.responseStatus = response;
        this.specialties.update(v => v.filter(item => item.id !== specialty.id));
      },
      error: (error) => (this.errorMessage = error as any),
    });
  }

  onNewSpecialty(newSpecialty: Specialty) {
    this.specialties.update(v => [...v, newSpecialty]);
    this.showAddSpecialtyComponent();
  }

  showAddSpecialtyComponent() {
    this.isInsert.update(v => !v);
  }

  showEditSpecialtyComponent(updatedSpecialty: Specialty) {
    this.router.navigate(['/specialties', updatedSpecialty.id.toString(), 'edit']);
  }

  gotoHome() {
    this.router.navigate(['/welcome']);
  }
}
