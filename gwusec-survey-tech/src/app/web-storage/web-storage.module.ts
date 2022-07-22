import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocalStorageService} from './local-storage.service';
import {SessionStorageService} from './session-storage.service';
import {StoreChangesGuard} from './store-changes.guard';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    LocalStorageService,
    SessionStorageService,
    StoreChangesGuard
  ]
})
export class WebStorageModule {
}
