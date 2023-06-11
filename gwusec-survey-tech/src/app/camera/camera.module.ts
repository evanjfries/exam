import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CameraComponent} from './camera.component';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {WebcamModule} from 'ngx-webcam';


@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    CommonModule,
    NgbAlertModule,
    FormsModule,
    WebcamModule
  ],
  exports: [
    CameraComponent,
  ]
})
export class CameraModule {
}
