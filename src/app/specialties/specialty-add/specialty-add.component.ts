import {Component, inject, output, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Specialty} from '../specialty';
import {SpecialtyService} from '../specialty.service';

@Component({
  selector: 'app-specialty-add',
  templateUrl: './specialty-add.component.html',
  styleUrls: ['./specialty-add.component.css'],
  imports: [ReactiveFormsModule],
})
export class SpecialtyAddComponent {
  private readonly specialtyService = inject(SpecialtyService);
  private readonly fb = inject(FormBuilder);

  errorMessage = signal('');
  newSpeciality = output<Specialty>();

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
    const specialty = { id: null, name: this.form.value.name } as unknown as Specialty;
    this.specialtyService.addSpecialty(specialty).subscribe({
      next: (newSpecialty) => {
        this.newSpeciality.emit(newSpecialty);
        this.form.reset();
      },
      error: (error) => this.errorMessage.set(error as any),
    });
  }
}
