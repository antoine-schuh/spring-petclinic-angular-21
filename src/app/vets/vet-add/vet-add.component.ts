import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatOption, MatSelect} from '@angular/material/select';
import {Router} from '@angular/router';
import {SpecialtyService} from 'app/specialties/specialty.service';
import {Specialty} from '../../specialties/specialty';
import {Vet} from '../vet';
import {VetService} from '../vet.service';

@Component({
  selector: 'app-vet-add',
  templateUrl: './vet-add.component.html',
  styleUrls: ['./vet-add.component.css'],
  imports: [ReactiveFormsModule, MatFormField, MatSelect, MatOption],
})
export class VetAddComponent {
  private specialtyService = inject(SpecialtyService);
  private vetService = inject(VetService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  specialtiesList = signal<Specialty[]>([]);
  errorMessage = signal('');

  firstNameCtrl   = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern('^[a-zA-Z]*$')]);
  lastNameCtrl    = new FormControl<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern('^[a-zA-Z]*$')]);
  specialtiesCtrl = new FormControl<Specialty[]>([], []);

  form = this.fb.group({
    firstName:   this.firstNameCtrl,
    lastName:    this.lastNameCtrl,
    specialties: this.specialtiesCtrl,
  });

  constructor() {
    this.specialtyService.getSpecialties()
      .pipe(takeUntilDestroyed())
      .subscribe(s => this.specialtiesList.set(s));
  }

  compareSpecFn(c1: Specialty, c2: Specialty): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onSubmit() {
    const fv = this.form.value;
    const vet = {
      id: null,
      firstName:   fv.firstName,
      lastName:    fv.lastName,
      specialties: fv.specialties ?? [],
    } as unknown as Vet;
    this.vetService.addVet(vet).subscribe({
      next: () => this.gotoVetList(),
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoVetList() {
    this.router.navigate(['/vets']);
  }
}
