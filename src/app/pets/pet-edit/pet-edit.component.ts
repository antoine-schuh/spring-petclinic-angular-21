import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle,} from '@angular/material/datepicker';
import {ActivatedRoute, Router} from '@angular/router';

import {format} from 'date-fns';
import {switchMap, tap} from 'rxjs';
import {Owner} from '../../owners/owner';
import {OwnerService} from '../../owners/owner.service';
import {PetType} from '../../pettypes/pettype';
import {PetTypeService} from '../../pettypes/pettype.service';
import {Pet} from '../pet';
import {PetService} from '../pet.service';

@Component({
  selector: 'app-pet-edit',
  templateUrl: './pet-edit.component.html',
  styleUrls: ['./pet-edit.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
  ],
})
export class PetEditComponent {
  private readonly petService = inject(PetService);
  private readonly petTypeService = inject(PetTypeService);
  private readonly ownerService = inject(OwnerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private petId = +this.route.snapshot.params.id;

  petTypes = signal<PetType[]>([]);
  pet = signal<Pet>({} as Pet);
  currentOwner = signal<Owner>({} as Owner);
  errorMessage = signal('');

  nameCtrl      = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern('^[A-Za-z0-9].{0,29}$')]);
  birthDateCtrl = new FormControl<Date | null>(null, [Validators.required]);
  typeCtrl      = new FormControl<number | null>(null, [Validators.required]);

  form = this.fb.group({
    name:      this.nameCtrl,
    birthDate: this.birthDateCtrl,
    type:      this.typeCtrl,
  });

  constructor() {
    this.petTypeService.getPetTypes()
      .pipe(takeUntilDestroyed())
      .subscribe(pt => this.petTypes.set(pt));

    this.petService.getPetById(this.petId).pipe(
      tap(p => {
        this.pet.set(p);
        if (p.id) {
          this.form.patchValue({
            name: p.name,
            birthDate: p.birthDate ? new Date(p.birthDate) : null,
            type: p.type?.id ?? null,
          });
        }
      }),
      switchMap(p => this.ownerService.getOwnerById(p.ownerId)),
      takeUntilDestroyed()
    ).subscribe({
      next: owner => this.currentOwner.set(owner),
      error: err => this.errorMessage.set(String(err))
    });
  }

  onSubmit() {
    const fv = this.form.value;
    const pet = {
      ...this.pet(),
      name:      fv.name,
      birthDate: format(new Date(fv.birthDate!), 'yyyy-MM-dd'),
      type:      this.petTypes().find(t => t.id === Number(fv.type)) ?? this.pet().type,
    } as Pet;
    this.petService.updatePet(pet.id.toString(), pet).subscribe({
      next: () => this.gotoOwnerDetail(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnerDetail() {
    this.router.navigate(['/owners', this.currentOwner().id]);
  }
}
