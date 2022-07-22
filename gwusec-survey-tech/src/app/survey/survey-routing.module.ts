import {RouterModule, Routes} from '@angular/router';
import {SurveyComponent} from './survey.component';
import {NgModule} from '@angular/core';
import {SurveyResolverGuard} from './survey-resolver.guard';

const surveyRoutes: Routes = [
    {
      path: 'survey/:surveyName',
      canActivate: [SurveyResolverGuard],
      canDeactivate: [SurveyResolverGuard],
      resolve: {survey: SurveyResolverGuard},
      children: [
        {
          path: '',
          component: SurveyComponent
        },
        {
          path: 'debug',
          loadChildren: () => import('./debug-mode/debug-mode.module').then(m => m.DebugModeModule)
        },
      ]
    },
    {path: '', redirectTo: '/survey', pathMatch: 'full'},
  ]
;

@NgModule({
  imports: [
    RouterModule.forChild(surveyRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SurveyRoutingModule {
}
