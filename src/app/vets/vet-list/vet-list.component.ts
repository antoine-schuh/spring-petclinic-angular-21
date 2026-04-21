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
  private vetService = inject(VetService);
  private router = inject(Router);

  vets = signal<Vet[]>([]);
  isVetDataReceived = signal(false);
  errorMessage = '';
  responseStatus: number;

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
      next: (response) => {
        this.responseStatus = response;
        this.vets.update(v => v.filter(item => item.id !== vet.id));
      },
      error: (error) => (this.errorMessage = error as any),
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
