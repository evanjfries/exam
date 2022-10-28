import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import { WebcamModule } from 'ngx-webcam';

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
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  routes: Routes = [
    { path: '/', component: WebcamModule},
  ];
}
