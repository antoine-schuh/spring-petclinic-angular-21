import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Owner} from '../owner';
import {OwnerService} from '../owner.service';

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
