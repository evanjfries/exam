import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarContentComponent, NavbarComponent, NavbarLogoComponent} from './navbar.component';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    NavbarComponent,
    NavbarContentComponent,
    NavbarLogoComponent
  ],
  imports: [
    CommonModule,
    NgbCollapseModule
  ],
  exports: [
    NavbarComponent,
    NavbarContentComponent,
    NavbarLogoComponent
  ]
})
export class NavbarModule {
}
