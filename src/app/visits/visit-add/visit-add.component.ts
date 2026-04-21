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
import {VisitListComponent} from '../visit-list/visit-list.component';
import {VisitService} from '../visit.service';

@Component({
  selector: 'app-visit-add',
  templateUrl: './visit-add.component.html',
  styleUrls: ['./visit-add.component.css'],
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    VisitListComponent,
  ],
})
export class VisitAddComponent {
  private visitService = inject(VisitService);
  private petService = inject(PetService);
  private ownerService = inject(OwnerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  private petId = +this.route.snapshot.params.id;

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
    this.petService.getPetById(this.petId).pipe(
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
      id: null,
      date: format(new Date(fv.date!), 'yyyy-MM-dd'),
      description: fv.description,
      pet: this.currentPet(),
    } as unknown as Visit;
    this.visitService.addVisit(visit).subscribe({
      next: () => this.gotoOwnerDetail(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoOwnerDetail() {
    this.router.navigate(['/owners', this.currentOwner().id]);
  }
}
