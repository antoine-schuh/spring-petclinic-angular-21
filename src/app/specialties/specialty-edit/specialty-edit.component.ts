import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Specialty} from '../specialty';
import {SpecialtyService} from '../specialty.service';

@Component({
  selector: 'app-specialty-edit',
  templateUrl: './specialty-edit.component.html',
  styleUrls: ['./specialty-edit.component.css'],
  imports: [ReactiveFormsModule],
})
export class SpecialtyEditComponent {
  private readonly specialtyService = inject(SpecialtyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private specId = this.route.snapshot.params.id;

  specialty = signal<Specialty>({} as Specialty);
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
    this.specialtyService.getSpecialtyById(this.specId)
      .pipe(takeUntilDestroyed())
      .subscribe(s => {
        this.specialty.set(s);
        this.form.patchValue({name: s.name});
      });
  }

  onSubmit() {
    const specialty: Specialty = { id: this.specialty().id, name: this.form.value.name! };
    this.specialtyService.updateSpecialty(specialty.id.toString(), specialty).subscribe({
      next: () => this.onBack(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  onBack() {
    this.router.navigate(['/specialties']);
  }
}
