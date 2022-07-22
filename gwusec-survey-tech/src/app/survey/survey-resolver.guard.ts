import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate, CanDeactivate,
  Resolve,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {SurveyService} from './survey.service';
import {catchError, defaultIfEmpty, map, take} from 'rxjs/operators';
import {Survey} from 'survey-angular';
import {ActiveSurveyService} from './active-survey.service';

@Injectable()
export class SurveyResolverGuard implements Resolve<Survey>, CanActivate, CanDeactivate<any> {

  constructor(
    private surveyService: SurveyService,
    private activeSurveyService: ActiveSurveyService,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Survey> {
    const surveyName = route.paramMap.get('surveyName');
    return surveyName ? this.surveyService.getSurveyConfig(surveyName)
      .pipe(
        take(1),
        map(surveyConfig => {
          const survey = this.surveyService.createSurvey(surveyConfig);
          this.activeSurveyService.setSurvey(surveyName, survey);
          return survey;
        })
      ) : EMPTY;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const surveyName = route.paramMap.get('surveyName');

    return surveyName ? this.surveyService.getSurveyConfig(surveyName)
      .pipe(
        take(1),
        map(() => true),
        defaultIfEmpty<boolean, UrlTree>(this.router.parseUrl(state.url.replace(new RegExp(`survey/${surveyName}.*$`), 'not-found'))),
        catchError(() => of(this.router.parseUrl(state.url.replace(new RegExp(`survey/${surveyName}.*$`), 'not-found'))))
      ) : EMPTY;
  }

  canDeactivate(): boolean {
    this.activeSurveyService.unsetSurvey();
    return true;
  }
}
