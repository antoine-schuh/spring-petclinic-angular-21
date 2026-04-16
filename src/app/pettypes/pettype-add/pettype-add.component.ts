import { Component, inject, output, signal } from '@angular/core';
import { PetType } from '../pettype';
import { PetTypeService } from '../pettype.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pettype-add',
  templateUrl: './pettype-add.component.html',
  styleUrls: ['./pettype-add.component.css'],
  imports: [ReactiveFormsModule],
})
export class PettypeAddComponent {
  private pettypeService = inject(PetTypeService);
  private fb = inject(FormBuilder);

  newPetType = output<PetType>();
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

  onSubmit() {
    const pettype = { id: null, name: this.form.value.name } as unknown as PetType;
    this.pettypeService.addPetType(pettype).subscribe({
      next: (newPettype) => {
        this.newPetType.emit(newPettype);
        this.form.reset();
      },
      error: (error) => this.errorMessage.set(error as any),
    });
  }
}
