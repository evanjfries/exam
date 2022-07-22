import {Injector, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SurveyComponent} from './survey.component';
import {RouterModule} from '@angular/router';
import {SurveyRoutingModule} from './survey-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {SurveyService} from './survey.service';
import {SurveyResolverGuard} from './survey-resolver.guard';
import {WebStorageModule} from '../web-storage/web-storage.module';
import {CountdownComponent} from './countdown.component';
import {bootstrapSurveyWidget} from './survey.widget';


@NgModule({
  declarations: [
    SurveyComponent,
    CountdownComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    SurveyRoutingModule,
    WebStorageModule,
  ],
  exports: [
    SurveyComponent,
    CountdownComponent,
  ],
  providers: [
    SurveyService,
    SurveyResolverGuard
  ]
})
export class SurveyModule {

  constructor(injector: Injector) {
    bootstrapSurveyWidget(CountdownComponent, {injector});
  }
}
