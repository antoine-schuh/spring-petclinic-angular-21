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

import { Component, inject, signal } from '@angular/core';
import { OwnerService } from '../owner.service';
import { Owner } from '../owner';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-owner-add',
  templateUrl: './owner-add.component.html',
  styleUrls: ['./owner-add.component.css'],
  imports: [ReactiveFormsModule],
})
export class OwnerAddComponent {
  private ownerService = inject(OwnerService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

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

  onSubmit() {
    const owner = { id: null, ...this.form.value } as unknown as Owner;
    this.ownerService.addOwner(owner).subscribe({
      next: () => this.gotoOwnersList(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnersList() {
    this.router.navigate(['/owners']);
  }
}
