import {Component, inject, input, signal} from '@angular/core';
import {Router} from '@angular/router';
import {VisitListComponent} from '../../visits/visit-list/visit-list.component';
import {Pet} from '../pet';
import {PetService} from '../pet.service';

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css'],
  imports: [VisitListComponent],
})
export class PetListComponent {
  private readonly router = inject(Router);
  private readonly petService = inject(PetService);

  pet = input.required<Pet>();
  errorMessage = signal('');
  deleteSuccess = signal(false);

  editPet(pet: Pet) {
    this.router.navigate(['/pets', pet.id, 'edit']);
  }

  deletePet(pet: Pet) {
    this.petService.deletePet(pet.id.toString()).subscribe({
      next: () => {
        this.deleteSuccess.set(true);
      },
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  addVisit(pet: Pet) {
    this.router.navigate(['/pets', pet.id, 'visits', 'add']);
  }
}
