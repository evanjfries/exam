import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FeedbackFormComponent} from './feedback-form.component';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    FeedbackFormComponent
  ],
  imports: [
    CommonModule,
    NgbAlertModule,
    FormsModule
  ],
  exports: [
    FeedbackFormComponent
  ]
})
export class FeedBackFormModule {
}
