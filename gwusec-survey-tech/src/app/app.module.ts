import {Injector, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NavbarModule} from './navbar/navbar.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {createCustomElement} from '@angular/elements';
import {FeedbackFormComponent} from './feedback-form/feedback-form.component';
import {WithdrawDialogComponent} from './withdraw-dialog/withdraw-dialog.component';
import {ActiveSurveyService} from './survey/active-survey.service';
import {renderTextAsHTML, sendResultsTo, surveyToggleNone} from './survey-utils';
import {FeedBackFormModule} from './feedback-form/feed-back-form.module';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {WebStorageModule} from './web-storage/web-storage.module';
import { CameraComponent } from './camera/camera.component';
import { WebcamModule } from 'ngx-webcam';
import { PretestComponent } from './pretest/pretest.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LandingPageComponent,
    WithdrawDialogComponent,
    CameraComponent,
    PretestComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    NavbarModule,
    BrowserAnimationsModule,
    NgbCollapseModule,
    AppRoutingModule,
    FeedBackFormModule,
    WebStorageModule,
    WebcamModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: 'surveyServiceConfig',
      useValue: {
        surveyConfigs: [
          {
            surveyName: 'test-survey',
            surveyUrl: 'assets/test-survey.json',
            surveySetupHooks: [
              renderTextAsHTML,
              sendResultsTo('http://localhost:8000/api/survey', {'content-type': 'application/json'}, false),
            ]
          },
        ],
        customFunctions: [
          {
            name: 'toggleNone',
            func: surveyToggleNone
          }
        ]
      }
    },
    ActiveSurveyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(injector: Injector) {
    const feedbackFormElement = createCustomElement(FeedbackFormComponent, {injector});
    customElements.define('surveyjs-feedback-form', feedbackFormElement);
  }

}
