import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LandingPageComponent} from './landing-page/landing-page.component';

const routes: Routes = [
  {path: 'start', component: LandingPageComponent},
  {
    path: 'main',
    loadChildren: () => import('./survey/survey.module').then(m => m.SurveyModule)
  },
  {path: '', redirectTo: 'start', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
