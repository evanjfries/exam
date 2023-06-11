import {CommonModule} from '@angular/common';
import {PretestComponent} from './pretest.component';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from '../camera/camera.component';
import { CameraModule } from '../camera/camera.module';
import {Injector, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {createCustomElement} from '@angular/elements';


@NgModule({
  declarations: [
    PretestComponent,
  ],
  imports: [
    CommonModule,
    NgbAlertModule,
    FormsModule,
    WebcamModule,
    CameraModule
  ],
  exports: [
    PretestComponent,
  ]
})
export class PretestModule {
    constructor(injector: Injector) {
        const cameraElement = createCustomElement(CameraComponent, {injector});
        customElements.define('app-camera', cameraElement);
      }
}
