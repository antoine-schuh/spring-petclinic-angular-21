import {Component} from '@angular/core';
import {VetTopWidgetComponent} from '../../vets/vet-top-widget/vet-top-widget.component';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  imports: [VetTopWidgetComponent],
})
export class WelcomeComponent {
}
