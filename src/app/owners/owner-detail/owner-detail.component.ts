import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';
import {PetListComponent} from '../../pets/pet-list/pet-list.component';
import {Owner} from '../owner';
import {OwnerService} from '../owner.service';

@Component({
  selector: 'app-owner-detail',
  templateUrl: './owner-detail.component.html',
  styleUrls: ['./owner-detail.component.css'],
  imports: [PetListComponent],
})
export class OwnerDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ownerService = inject(OwnerService);

  private ownerId = this.route.snapshot.params.id;

  owner = signal<Owner>({} as Owner);

  constructor() {
    this.ownerService.getOwnerById(this.ownerId)
      .pipe(takeUntilDestroyed())
      .subscribe(o => this.owner.set(o));
  }

  gotoOwnersList() {
    this.router.navigate(['/owners']);
  }

  editOwner() {
    this.router.navigate(['/owners', this.owner().id, 'edit']);
  }

  addPet(owner: Owner) {
    this.router.navigate(['/owners', owner.id, 'pets', 'add']);
  }
}
