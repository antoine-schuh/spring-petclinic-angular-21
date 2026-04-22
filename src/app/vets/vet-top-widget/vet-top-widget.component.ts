import {Component, inject, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {VetTop} from '../vet-top';
import {VetService} from '../vet.service';

@Component({
  selector: 'app-vet-top-widget',
  templateUrl: './vet-top-widget.component.html',
  styleUrls: ['./vet-top-widget.component.css'],
})
export class VetTopWidgetComponent {
  private readonly vetService = inject(VetService);

  topVets = signal<VetTop[]>([]);

  constructor() {
    this.vetService.getTopVets()
      .pipe(takeUntilDestroyed())
      .subscribe(vets => this.topVets.set(vets));
  }
}
