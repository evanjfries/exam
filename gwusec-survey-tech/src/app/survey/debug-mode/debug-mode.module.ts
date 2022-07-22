import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DebugModeComponent} from './debug-mode.component';
import {NgbCollapseModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DebugModeRoutingModule} from './debug-mode-routing.module';


@NgModule({
  declarations: [
    DebugModeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbCollapseModule,
    NgbDropdownModule,
    DebugModeRoutingModule
  ],
  exports: [
    DebugModeComponent
  ]
})
export class DebugModeModule {
}
