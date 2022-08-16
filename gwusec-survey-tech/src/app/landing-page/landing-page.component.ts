import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent {
  started=false;

  constructor() {
  }

  start(){
    this.started=true;
  }
}
