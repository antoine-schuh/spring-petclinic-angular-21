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

import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { OwnerService } from '../owner.service';
import { Owner } from '../owner';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css'],
  imports: [ReactiveFormsModule],
})
export class OwnerEditComponent {
  private ownerService = inject(OwnerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private ownerId = this.route.snapshot.params.id;

  ownerResource = rxResource<Owner, void>({
    stream: () => this.ownerService.getOwnerById(this.ownerId),
  });

  owner = linkedSignal<Owner>(() => this.ownerResource.value() ?? ({} as Owner));
  errorMessage = signal('');

  firstNameCtrl = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern('^[a-zA-Z]*$')]);
  lastNameCtrl  = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern('^[a-zA-Z]*$')]);
  addressCtrl   = new FormControl<string>('', [Validators.required, Validators.maxLength(255)]);
  cityCtrl      = new FormControl<string>('', [Validators.required, Validators.maxLength(80)]);
  telephoneCtrl = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(20), Validators.pattern('^[0-9]*$')]);

  form = this.fb.group({
    firstName: this.firstNameCtrl,
    lastName:  this.lastNameCtrl,
    address:   this.addressCtrl,
    city:      this.cityCtrl,
    telephone: this.telephoneCtrl,
  });

  constructor() {
    effect(() => {
      const o = this.owner();
      if (o.id) {
        this.form.patchValue({
          firstName: o.firstName,
          lastName:  o.lastName,
          address:   o.address,
          city:      o.city,
          telephone: o.telephone,
        });
      }
    });
  }

  onSubmit() {
    const owner = { id: Number(this.ownerId), ...this.form.value } as Owner;
    this.ownerService.updateOwner(this.ownerId, owner).subscribe({
      next: () => this.gotoOwnerDetail(owner),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnerDetail(owner: Owner) {
    this.errorMessage.set('');
    this.router.navigate(['/owners', owner.id]);
  }
}
