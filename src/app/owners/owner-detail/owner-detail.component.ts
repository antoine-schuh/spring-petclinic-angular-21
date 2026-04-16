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

import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { OwnerService } from '../owner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Owner } from '../owner';
import { PetListComponent } from '../../pets/pet-list/pet-list.component';

@Component({
  selector: 'app-owner-detail',
  templateUrl: './owner-detail.component.html',
  styleUrls: ['./owner-detail.component.css'],
  imports: [PetListComponent],
})
export class OwnerDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ownerService = inject(OwnerService);

  private ownerId = this.route.snapshot.params.id;

  ownerResource = rxResource<Owner, void>({
    stream: () => this.ownerService.getOwnerById(this.ownerId),
  });

  owner = computed(() => this.ownerResource.value() ?? ({} as Owner));

  gotoOwnersList() {
    this.router.navigate(['/owners']);
  }

  editOwner() {
    this.router.navigate(['/owners', this.owner().id, 'edit']);
  }

  addPet(owner: Owner) {
    this.router.navigate(['/owners', owner.id, 'pets', 'add']);
  }
}
