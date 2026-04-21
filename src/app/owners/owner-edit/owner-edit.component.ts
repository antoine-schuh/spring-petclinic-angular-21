import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Owner} from '../owner';
import {OwnerService} from '../owner.service';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css'],
  imports: [ReactiveFormsModule],
})
export class OwnerEditComponent {
  private readonly ownerService = inject(OwnerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private ownerId = this.route.snapshot.params.id;

  owner = signal<Owner>({} as Owner);
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
    this.ownerService.getOwnerById(this.ownerId)
      .pipe(takeUntilDestroyed())
      .subscribe(o => {
        this.owner.set(o);
        this.form.patchValue({
          firstName: o.firstName,
          lastName:  o.lastName,
          address:   o.address,
          city:      o.city,
          telephone: o.telephone,
        });
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
