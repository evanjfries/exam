import {Injectable, OnDestroy} from '@angular/core';
import {asapScheduler, BehaviorSubject, fromEvent, Observable} from 'rxjs';
import {Survey} from 'survey-angular';
import {map, observeOn, pairwise} from 'rxjs/operators';
import {LocalStorageService} from '../web-storage/local-storage.service';


export abstract class ParticipantInfo {
  abstract setInfo(survey: Survey): void;
}

type SurveyEntry = [string | null, Survey | null];

export function relaxSurveyValidation(survey: Survey): {restore: () => void} {
  const orgIgnoreValidation = survey.ignoreValidation;
  survey.ignoreValidation = true;

  return {restore: () => {
      survey.ignoreValidation = orgIgnoreValidation;
    }};
}

export function surveyDisplayMode(survey: Survey): {restore: () => void} {
  const orgMode = survey.mode;
  survey.mode = 'display';

  return {restore: () => {
      survey.mode = orgMode;
    }};
}

@Injectable()
export class ActiveSurveyService implements OnDestroy {

  private static readonly STORAGE_PREFIX = 'survey-state_';

  private readonly survey$ = new BehaviorSubject<SurveyEntry>([null, null]);

  constructor(localStorage: LocalStorageService) {

    // Function to store the survey state in the local storage
    function storeSurveyState(localStorageName: string | null, survey: Survey | null): void {
      if (localStorageName && survey) {
        const surveyRecord = {
          state: survey.state,
          currentPageNo: survey.currentPageNo,
          data: survey.data
        };
        localStorage.setObject(localStorageName, surveyRecord);
      }
    }

    // Function to load the survey state from the local storage
    function loadSurveyState(localStorageName: string | null, survey: Survey | null): void {
      if (localStorageName && survey) {
        const surveyRecord = localStorage.getObject(localStorageName);
        if (surveyRecord) {
          survey.clear(true, true);
          // Set survey results
          survey.data = surveyRecord.data;
          // Relax validation so that the state can easier changed
          const surveyValidation = relaxSurveyValidation(survey);
          // Restore survey state
          switch (surveyRecord.state) {
            // Set survey state to 'completed' state via doComplete method
            case 'completed':
              survey.doComplete();
              break;
            // Set survey state to 'running' via start method
            case 'running':
              const surveyMode = surveyDisplayMode(survey);
              survey.start();
              survey.currentPage = surveyRecord.currentPageNo;
              surveyMode.restore();
              break;
            // Do nothing for all other states
            case 'loading':
            case 'starting':
            case 'empty':
            default:
          }
          // Restore survey validation
          surveyValidation.restore();
        }
      }
    }

    const next = ([[oldName, oldSurvey], [currentName, currentSurvey]]: [SurveyEntry, SurveyEntry]) => {
      // Store old survey state
      storeSurveyState(ActiveSurveyService.STORAGE_PREFIX + oldName, oldSurvey);
      // Load new survey state and register callback to store the state on partial send and on complete events
      loadSurveyState(ActiveSurveyService.STORAGE_PREFIX + currentName, currentSurvey);
      // if (currentSurvey != null) {
      //   const storeCurrent = () => storeSurveyState(ActiveSurveyService.STORAGE_PREFIX + currentName, currentSurvey);
      //   currentSurvey.onPartialSend.add(storeCurrent);
      //   currentSurvey.onComplete.add(storeCurrent);
      // }
    };

    const complete = () => {
      const [surveyName, survey] = this.survey$.value;
      storeSurveyState(ActiveSurveyService.STORAGE_PREFIX + surveyName, survey);
    };

    this.survey$.pipe(pairwise()).subscribe({next, complete});
    fromEvent(window, 'beforeunload').subscribe(complete);

  }

  ngOnDestroy(): void {
    this.unsetSurvey();
    this.survey$.complete();
  }

  getSurvey(): Observable<Survey | null> {
    return this.survey$.pipe(
      map(([, survey]) => survey),
      observeOn(asapScheduler)
    );
  }

  unsetSurvey(): void {
    this.survey$.next([null, null]);
  }

  setSurvey(surveyName: string, survey: Survey): void {
    this.survey$.next([surveyName, survey]);
  }
}
