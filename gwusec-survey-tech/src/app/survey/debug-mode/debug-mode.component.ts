import {AfterViewInit, Component, HostListener, OnDestroy} from '@angular/core';
import * as SurveyJs from 'survey-angular';
import {PageModel, Survey} from 'survey-angular';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActiveSurveyService, relaxSurveyValidation, surveyDisplayMode} from '../active-survey.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {SurveyService} from '../survey.service';
import {SessionStorageService} from '../../web-storage/session-storage.service';

interface WindowWithSurvey extends Window {
  Survey?: any;
  survey?: Survey;
}

interface UiState {
  sidebar: {
    isCollapsed: boolean,
    navigation: {
      isCollapsed: boolean,
    },
    operations: {
      isCollapsed: boolean,
    },
    pages: {
      isCollapsed: boolean,
    },
    surveyProperties: {
      selected: any
    },
    surveyData: {
      isCollapsed: boolean,
    },
  };
}


@Component({
  selector: 'app-debug-mode',
  templateUrl: './debug-mode.component.html',
  styleUrls: ['./debug-mode.component.scss'],
})
export class DebugModeComponent implements OnDestroy, AfterViewInit {

  private destroyed$ = new Subject<void>();
  survey$: Observable<Survey | null>;
  surveyNames$: Observable<string[]>;

  public uiState: UiState = {
    sidebar: {
      isCollapsed: false,
      navigation: {
        isCollapsed: true,
      },
      operations: {
        isCollapsed: true,
      },
      pages: {
        isCollapsed: true,
      },
      surveyProperties: {
        selected: null
      },
      surveyData: {
        isCollapsed: true,
      },
    }
  };

  constructor(
    private sessionStorage: SessionStorageService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private activeSurveyService: ActiveSurveyService,
    private surveyConfigService: SurveyService
  ) {
    breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
        this.uiState.sidebar.isCollapsed = result.matches;
      });

    this.survey$ = this.activeSurveyService.getSurvey();
    this.surveyNames$ = this.surveyConfigService.getSurveyNames();

    // Merge stored uiState and default uiState
    this.uiState = {...this.uiState, ...this.sessionStorage.getObject(DebugModeComponent.name + 'uiState')};
  }

  ngAfterViewInit(): void {
    // Make survey object accessibly via document object
    this.survey$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(survey => {
        if (survey) {
          (window as WindowWithSurvey).survey = survey;
          (window as WindowWithSurvey).Survey = SurveyJs;
        }
      });
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    // Remove reference to survey from document object when leaving debug mode
    delete (window as WindowWithSurvey).survey;
    delete (window as WindowWithSurvey).Survey;
    this.destroyed$.next();
    this.destroyed$.complete();

    this.sessionStorage.setObject(DebugModeComponent.name + 'uiState', this.uiState);
  }

  startSurvey(survey: Survey): void {
    const surveyMode = surveyDisplayMode(survey);
    survey.start();
    surveyMode.restore();
  }

  previousPage(survey: Survey): void {
    const surveyValidation = relaxSurveyValidation(survey);
    if (survey.isFirstPage) {
      this.clearSurvey(survey, false, true);
    } else if (survey.state === 'completed') {
      this.clearSurvey(survey, false, false);
    } else {
      survey.prevPage();
    }
    surveyValidation.restore();
  }

  nextPage(survey: Survey): void {
    const surveyValidation = relaxSurveyValidation(survey);
    if (survey.state === 'starting') {
      this.startSurvey(survey);
    } else {
      survey.nextPage();
    }
    surveyValidation.restore();
  }

  completeSurvey(survey: Survey): void {
    const surveyValidation = relaxSurveyValidation(survey);
    survey.doComplete();
    surveyValidation.restore();
  }

  clearSurvey(survey: Survey, clearData = true, goToFirstPage = true): void {
    const state = survey.state;
    // Clear the survey and restart from the beginning.
    survey.clear(clearData, goToFirstPage);
    survey.deleteCookie();

    if (!goToFirstPage && state !== 'starting') {
      this.startSurvey(survey);
    }
  }

  gotoPage(survey: Survey, page: PageModel): void {
    const surveyValidation = relaxSurveyValidation(survey);
    if (survey.state === 'completed') {
      this.clearSurvey(survey, false, false);
    }
    if (survey.state === 'starting') {
      this.startSurvey(survey);
    }
    survey.currentPage = page;
    surveyValidation.restore();
  }

  getCurrentPage(survey: Survey): PageModel | undefined {
    switch (survey.state) {
      case 'starting':
        return survey.startedPage;
      default:
        return survey.currentPage;
    }
  }

  isDataEmpty(survey: Survey): boolean {
    return Object.keys(survey.data).length === 0;
  }
}
