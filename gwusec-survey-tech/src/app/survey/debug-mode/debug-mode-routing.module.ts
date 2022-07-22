import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebugModeComponent } from './debug-mode.component';
import { SurveyComponent } from '../survey.component';

const routes: Routes = [
  {
    path: '',
    component: DebugModeComponent,
    children: [
      {
        path: '',
        component: SurveyComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebugModeRoutingModule { }
