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

import { Component, computed, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Vet } from '../vet';
import { VetService } from '../vet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vet-list',
  templateUrl: './vet-list.component.html',
  styleUrls: ['./vet-list.component.css'],
})
export class VetListComponent {
  private vetService = inject(VetService);
  private router = inject(Router);

  vetsResource = rxResource<Vet[], void>({
    stream: () => this.vetService.getVets(),
  });

  vets = linkedSignal<Vet[]>(() => this.vetsResource.value() ?? []);
  isVetDataReceived = computed(() => !this.vetsResource.isLoading());
  errorMessage = '';
  responseStatus: number;

  deleteVet(vet: Vet) {
    this.vetService.deleteVet(vet.id.toString()).subscribe({
      next: (response) => {
        this.responseStatus = response;
        this.vets.update(v => v.filter(item => item.id !== vet.id));
      },
      error: (error) => (this.errorMessage = error as any),
    });
  }

  gotoHome() {
    this.router.navigate(['/welcome']);
  }

  addVet() {
    this.router.navigate(['/vets/add']);
  }

  editVet(vet: Vet) {
    this.router.navigate(['/vets', vet.id, 'edit']);
  }
}
