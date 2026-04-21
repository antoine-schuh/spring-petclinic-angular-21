import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {PetType} from '../pettype';
import {PettypeAddComponent} from '../pettype-add/pettype-add.component';
import {PetTypeService} from '../pettype.service';

@Component({
  selector: 'app-pettype-list',
  templateUrl: './pettype-list.component.html',
  styleUrls: ['./pettype-list.component.css'],
  imports: [FormsModule, PettypeAddComponent],
})
export class PettypeListComponent {
  private readonly pettypeService = inject(PetTypeService);
  private readonly router = inject(Router);

  pettypes = signal<PetType[]>([]);
  isPetTypesDataReceived = signal(false);
  errorMessage = signal('');
  isInsert = signal(false);

  constructor() {
    this.pettypeService.getPetTypes()
      .pipe(takeUntilDestroyed())
      .subscribe(pt => {
        this.pettypes.set(pt);
        this.isPetTypesDataReceived.set(true);
      });
  }

  deletePettype(pettype: PetType) {
    this.pettypeService.deletePetType(pettype.id.toString()).subscribe({
      next: () => {
        this.pettypes.update(v => v.filter(item => item.id !== pettype.id));
      },
      error: (error) => this.errorMessage.set(error as any),
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
