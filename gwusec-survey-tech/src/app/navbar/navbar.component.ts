import {Component} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  public isMenuCollapsed = true;

  constructor() {
  }
}

@Component({
  selector: 'app-navbar-content',
  template: `
    <ng-content></ng-content>`
})
export class NavbarContentComponent {
}

@Component({
  selector: 'app-navbar-logo',
  template: `
    <ng-content></ng-content>`
})
export class NavbarLogoComponent {
}
