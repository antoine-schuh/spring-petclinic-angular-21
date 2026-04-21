import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {switchMap} from 'rxjs';
import {Owner} from '../owner';
import {OwnerService} from '../owner.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css'],
  imports: [FormsModule, RouterLinkActive, RouterLink],
})
export class OwnerListComponent {
  private router = inject(Router);
  private ownerService = inject(OwnerService);

  lastName = '';
  private searchKey = signal('');

  owners = signal<Owner[] | null>(null);
  isOwnersDataReceived = signal(false);

  constructor() {
    toObservable(this.searchKey).pipe(
      switchMap(key => key === '' ? this.ownerService.getOwners() : this.ownerService.searchOwners(key)),
      takeUntilDestroyed()
    ).subscribe({
      next: owners => {
        this.owners.set(owners);
        this.isOwnersDataReceived.set(true);
      }
    });
  }

  onSelect(owner: Owner) {
    this.router.navigate(['/owners', owner.id]);
  }

  addOwner() {
    this.router.navigate(['/owners/add']);
  }

  searchByLastName(lastName: string) {
    this.searchKey.set(lastName);
  }
}
