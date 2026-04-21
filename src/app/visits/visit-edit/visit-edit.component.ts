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
import {Pet} from '../../pets/pet';
import {PetService} from '../../pets/pet.service';
import {PetType} from '../../pettypes/pettype';
import {Visit} from '../visit';
import {VisitService} from '../visit.service';

@Component({
  selector: 'app-visit-edit',
  templateUrl: './visit-edit.component.html',
  styleUrls: ['./visit-edit.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
  ],
})
export class VisitEditComponent {
  private visitService = inject(VisitService);
  private petService = inject(PetService);
  private ownerService = inject(OwnerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private visitId = this.route.snapshot.params.id as string;

  visit = signal<Visit>({} as Visit);
  currentPet = signal<Pet>({} as Pet);
  currentOwner = signal<Owner>({} as Owner);
  currentPetType = signal<PetType>({} as PetType);
  errorMessage = signal('');

  dateCtrl        = new FormControl<Date | null>(null, [Validators.required]);
  descriptionCtrl = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]);

  form = this.fb.group({
    date:        this.dateCtrl,
    description: this.descriptionCtrl,
  });

  constructor() {
    this.visitService.getVisitById(this.visitId).pipe(
      tap(v => {
        this.visit.set(v);
        if (v.id) {
          this.form.patchValue({
            date: v.date ? new Date(v.date) : null,
            description: v.description,
          });
        }
      }),
      switchMap(v => this.petService.getPetById(v.petId)),
      tap(pet => {
        this.currentPet.set(pet);
        this.currentPetType.set(pet.type ?? ({} as PetType));
      }),
      switchMap(pet => this.ownerService.getOwnerById(pet.ownerId)),
      takeUntilDestroyed()
    ).subscribe({
      next: owner => this.currentOwner.set(owner),
      error: err => this.errorMessage.set(String(err))
    });
  }

  onSubmit() {
    const fv = this.form.value;
    const visit = {
      ...this.visit(),
      date:        format(new Date(fv.date!), 'yyyy-MM-dd'),
      description: fv.description,
      pet:         this.currentPet(),
    } as Visit;
    this.visitService.updateVisit(visit.id.toString(), visit).subscribe({
      next: () => this.gotoOwnerDetail(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnerDetail() {
    this.router.navigate(['/owners', this.currentOwner().id]);
  }
}
