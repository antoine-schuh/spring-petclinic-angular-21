import {Component, computed, inject, input, linkedSignal} from '@angular/core';
import {Router} from '@angular/router';
import {Visit} from '../visit';
import {VisitService} from '../visit.service';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.css'],
})
export class VisitListComponent {
  private router = inject(Router);
  private visitService = inject(VisitService);

  visits = input<Visit[]>([]);
  localVisits = linkedSignal(() => this.visits() ?? []);
  noVisits = computed(() => this.localVisits().length === 0);
  errorMessage = '';

  editVisit(visit: Visit) {
    this.router.navigate(['/visits', visit.id, 'edit']);
  }

  deleteVisit(visit: Visit) {
    this.visitService.deleteVisit(visit.id.toString()).subscribe({
      next: () => {
        this.localVisits.update(v => v.filter(item => item.id !== visit.id));
      },
      error: (error) => (this.errorMessage = error as any),
    });
  }
}
