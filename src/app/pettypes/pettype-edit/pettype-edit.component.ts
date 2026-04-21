import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PetType} from '../pettype';
import {PetTypeService} from '../pettype.service';

@Component({
  selector: 'app-pettype-edit',
  templateUrl: './pettype-edit.component.html',
  styleUrls: ['./pettype-edit.component.css'],
  imports: [ReactiveFormsModule],
})
export class PettypeEditComponent {
  private readonly pettypeService = inject(PetTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private pettypeId = this.route.snapshot.params.id;

  pettype = signal<PetType>({} as PetType);
  errorMessage = signal('');

  nameCtrl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(80),
    Validators.pattern('^[A-Za-z0-9].{0,79}$'),
  ]);

  form = this.fb.group({
    name: this.nameCtrl,
  });

  constructor() {
    this.pettypeService.getPetTypeById(this.pettypeId)
      .pipe(takeUntilDestroyed())
      .subscribe(p => {
        this.pettype.set(p);
        this.form.patchValue({name: p.name});
      });
  }

  onSubmit() {
    const pettype: PetType = { id: this.pettype().id, name: this.form.value.name! };
    this.pettypeService.updatePetType(pettype.id.toString(), pettype).subscribe({
      next: () => this.onBack(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  onBack() {
    this.router.navigate(['/pettypes']);
  }
}
