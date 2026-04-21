import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Specialty} from '../specialty';
import {SpecialtyAddComponent} from '../specialty-add/specialty-add.component';
import {SpecialtyService} from '../specialty.service';

@Component({
  selector: 'app-specialty-list',
  templateUrl: './specialty-list.component.html',
  styleUrls: ['./specialty-list.component.css'],
  imports: [FormsModule, SpecialtyAddComponent],
})
export class SpecialtyListComponent {
  private specService = inject(SpecialtyService);
  private router = inject(Router);

  specialties = signal<Specialty[]>([]);
  isSpecialitiesDataReceived = signal(false);
  errorMessage = '';
  responseStatus: number;
  isInsert = signal(false);

  constructor() {
    this.specService.getSpecialties()
      .pipe(takeUntilDestroyed())
      .subscribe(s => {
        this.specialties.set(s);
        this.isSpecialitiesDataReceived.set(true);
      });
  }

  deleteSpecialty(specialty: Specialty) {
    this.specService.deleteSpecialty(specialty.id.toString()).subscribe({
      next: (response) => {
        this.responseStatus = response;
        this.specialties.update(v => v.filter(item => item.id !== specialty.id));
      },
      error: (error) => (this.errorMessage = error as any),
    });
  }

  onNewSpecialty(newSpecialty: Specialty) {
    this.specialties.update(v => [...v, newSpecialty]);
    this.showAddSpecialtyComponent();
  }

  showAddSpecialtyComponent() {
    this.isInsert.update(v => !v);
  }

  showEditSpecialtyComponent(updatedSpecialty: Specialty) {
    this.router.navigate(['/specialties', updatedSpecialty.id.toString(), 'edit']);
  }

  gotoHome() {
    this.router.navigate(['/welcome']);
  }
}
