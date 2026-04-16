import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PetType } from '../pettype';
import { Router } from '@angular/router';
import { PetTypeService } from '../pettype.service';
import { FormsModule } from '@angular/forms';
import { PettypeAddComponent } from '../pettype-add/pettype-add.component';

@Component({
  selector: 'app-pettype-list',
  templateUrl: './pettype-list.component.html',
  styleUrls: ['./pettype-list.component.css'],
  imports: [FormsModule, PettypeAddComponent],
})
export class PettypeListComponent {
  private pettypeService = inject(PetTypeService);
  private router = inject(Router);

  pettypeResource = rxResource<PetType[], void>({
    stream: () => this.pettypeService.getPetTypes(),
  });

  pettypes = linkedSignal<PetType[]>(() => this.pettypeResource.value() ?? []);
  isPetTypesDataReceived = computed(() => !this.pettypeResource.isLoading());
  errorMessage = '';
  responseStatus: number;
  isInsert = signal(false);

  deletePettype(pettype: PetType) {
    this.pettypeService.deletePetType(pettype.id.toString()).subscribe({
      next: (response) => {
        this.responseStatus = response;
        this.pettypes.update(v => v.filter(item => item.id !== pettype.id));
      },
      error: (error) => (this.errorMessage = error as any),
    });
  }

  onNewPettype(newPetType: PetType) {
    this.pettypes.update(v => [...v, newPetType]);
    this.showAddPettypeComponent();
  }

  showAddPettypeComponent() {
    this.isInsert.update(v => !v);
  }

  showEditPettypeComponent(updatedPetType: PetType) {
    this.router.navigate(['/pettypes', updatedPetType.id.toString(), 'edit']);
  }

  gotoHome() {
    this.router.navigate(['/welcome']);
  }
}
