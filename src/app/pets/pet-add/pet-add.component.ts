import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle,} from '@angular/material/datepicker';
import {ActivatedRoute, Router} from '@angular/router';

import {format} from 'date-fns';
import {Owner} from '../../owners/owner';
import {OwnerService} from '../../owners/owner.service';
import {PetType} from '../../pettypes/pettype';
import {PetTypeService} from '../../pettypes/pettype.service';
import {Pet} from '../pet';
import {PetService} from '../pet.service';

@Component({
  selector: 'app-pet-add',
  templateUrl: './pet-add.component.html',
  styleUrls: ['./pet-add.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
  ],
})
export class PetAddComponent {
  private readonly ownerService = inject(OwnerService);
  private readonly petService = inject(PetService);
  private readonly petTypeService = inject(PetTypeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private ownerId = this.route.snapshot.params.id;

  petTypes = signal<PetType[]>([]);
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
    this.ownerService.getOwnerById(this.ownerId)
      .pipe(takeUntilDestroyed())
      .subscribe(o => this.currentOwner.set(o));
  }

  onSubmit() {
    const fv = this.form.value;
    const pet = {
      id: null,
      name: fv.name,
      birthDate: format(new Date(fv.birthDate!), 'yyyy-MM-dd'),
      type: this.petTypes().find(t => t.id === Number(fv.type)),
      owner: this.currentOwner(),
    } as unknown as Pet;
    this.petService.addPet(pet).subscribe({
      next: () => this.gotoOwnerDetail(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnerDetail() {
    this.router.navigate(['/owners', this.currentOwner().id]);
  }
}
