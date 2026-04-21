import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {MatFormField, MatOption, MatSelect} from '@angular/material/select';
import {ActivatedRoute, Router} from '@angular/router';
import {Specialty} from '../../specialties/specialty';
import {SpecialtyService} from '../../specialties/specialty.service';
import {Vet} from '../vet';
import {VetService} from '../vet.service';

@Component({
  selector: 'app-vet-edit',
  templateUrl: './vet-edit.component.html',
  styleUrls: ['./vet-edit.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
  ],
})
export class VetEditComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly specialtyService = inject(SpecialtyService);
  private readonly vetService = inject(VetService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  vetEditForm: FormGroup;
  idCtrl: FormControl;
  firstNameCtrl: FormControl;
  lastNameCtrl: FormControl;
  specialtiesCtrl: FormControl;
  vet: Vet;
  specList: Specialty[];
  errorMessage = signal('');

  constructor() {
    this.vet = {} as Vet;
    this.specList = [] as Specialty[];
    this.buildForm();
    this.specList = this.route.snapshot.data.specs;
    this.vet = this.route.snapshot.data.vet;
    this.vet.specialties = this.route.snapshot.data.vet.specialties;
    this.initFormValues();
  }

  buildForm() {
    this.idCtrl = new FormControl(null);
    this.firstNameCtrl = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]);
    this.lastNameCtrl = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]);
    this.specialtiesCtrl = new FormControl(null);
    this.vetEditForm = this.formBuilder.group({
      id: this.idCtrl,
      firstName: this.firstNameCtrl,
      lastName: this.lastNameCtrl,
      specialties: this.specialtiesCtrl,
    });
  }

  compareSpecFn(c1: Specialty, c2: Specialty): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  initFormValues() {
    this.idCtrl.setValue(this.vet.id);
    this.firstNameCtrl.setValue(this.vet.firstName);
    this.lastNameCtrl.setValue(this.vet.lastName);
    this.specialtiesCtrl.setValue(this.vet.specialties);
  }

  onSubmit(vet: Vet) {
    this.vetService.updateVet(vet.id.toString(), vet).subscribe({
      next: () => {
        this.gotoVetList();
      },
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoVetList() {
    this.router.navigate(['/vets']);
  }
}
