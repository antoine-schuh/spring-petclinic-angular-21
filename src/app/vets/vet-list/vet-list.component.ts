import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {Vet} from '../vet';
import {VetService} from '../vet.service';

@Component({
  selector: 'app-vet-list',
  templateUrl: './vet-list.component.html',
  styleUrls: ['./vet-list.component.css'],
})
export class VetListComponent {
  private readonly vetService = inject(VetService);
  private readonly router = inject(Router);

  vets = signal<Vet[]>([]);
  isVetDataReceived = signal(false);
  errorMessage = signal('');

  constructor() {
    this.vetService.getVets()
      .pipe(takeUntilDestroyed())
      .subscribe(v => {
        this.vets.set(v);
        this.isVetDataReceived.set(true);
      });
  }

  deleteVet(vet: Vet) {
    this.vetService.deleteVet(vet.id.toString()).subscribe({
      next: () => {
        this.vets.update(v => v.filter(item => item.id !== vet.id));
      },
      error: (error) => this.errorMessage.set(error as any),
    });
  }

  gotoHome() {
    this.router.navigate(['/welcome']);
  }

  addVet() {
    this.router.navigate(['/vets/add']);
  }

  editVet(vet: Vet) {
    this.router.navigate(['/vets', vet.id, 'edit']);
  }
}
