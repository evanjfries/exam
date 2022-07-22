import {Inject, Injectable, OnDestroy} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Model, FunctionFactory, Survey} from 'survey-angular';

export interface SurveyJson {
  [key: string]: any;
}

export interface SurveyConfig {
  /**
   * Unique name of the survey config.
   */
  surveyName: string;
  /**
   * Survey config object for SurveyJS.
   */
  surveyJson: SurveyJson;
  /**
   *
   */
  surveySetupHooks?: ((survey: Survey, httpClient: HttpClient) => void)[];
}

export interface UnresolvedSurveyConfig {
  /**
   * Unique name of the survey config.
   * Note: Survey configs with duplicate names will be overridden by the last given survey config.
   */
  surveyName: string;
  /**
   * Survey config object for SurveyJS. If provided,
   * do not supply a survey config json file using `surveyUrl`.
   */
  surveyJson?: SurveyJson;
  /**
   * The relative path or absolute URL of a SurveyJS config json file.
   * If provided, do not supply an inline survey config json object using `survey`.
   */
  surveyUrl?: any;
  /**
   *
   */
  surveySetupHooks?: ((survey: Survey, httpClient: HttpClient) => void)[];
}

/**
 * Supplies configuration metadata for an SurveyJS SurveyService.
 *
 * @publicApi
 */
export interface SurveyServiceConfig {
  surveyConfigs?: UnresolvedSurveyConfig[];
  /**
   *
   */
  customFunctions?: {
    name: string,
    func: (params: any[]) => any,
    isAsync?: boolean
  }[];
}

@Injectable()
export class SurveyService implements OnDestroy {

  // Map of survey names and 'observable' survey configs
  private readonly surveyConfigMap = new Map<string, Observable<SurveyConfig>>();

  constructor(
    private http: HttpClient,
    @Inject('surveyServiceConfig') private surveyServiceConfig: SurveyServiceConfig,
  ) {
    if (this.surveyServiceConfig.surveyConfigs) {
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
      // Store the name and config object (as an ReplaySubject) for each survey config given via 'surveyConfig'
      for (const {surveyName, surveyJson, surveyUrl, surveySetupHooks} of this.surveyServiceConfig.surveyConfigs) {
        // An URL is specified where to find the survey config
        if (surveyUrl) {
          // Create and store HTTP request for the given URL as ReplaySubject
          this.surveyConfigMap.set(
            surveyName,
            http.get<SurveyJson>(surveyUrl, {headers})
              .pipe(
                map(surveyJson => {
                  return {
                    surveyName,
                    surveyJson,
                    surveySetupHooks
                  };
                }),
                shareReplay(1)
              )
          );
        } else if (surveyJson) { // An object is specified which is the survey config
          // Create and store given survey config as ReplaySubject
          this.surveyConfigMap.set(
            surveyName,
            of({
              surveyName,
              surveyJson,
              surveySetupHooks
            }).pipe(shareReplay(1))
          );
        } else { // Neither a URL or config object is specified
          throw new Error(
            `Error in SurveyServiceConfig object (specify either "survey" or "surveyUrl" field for "${surveyName}")`
          );
        }
      }
    }

    this.surveyServiceConfig.customFunctions?.forEach(({name, func, isAsync}) => FunctionFactory.Instance.register(name, func, isAsync));
  }

  ngOnDestroy(): void {
    this.surveyServiceConfig.customFunctions?.forEach(({name}) => FunctionFactory.Instance.unregister(name));
  }

  /**
   * Get observable survey config for a given name.
   */
  getSurveyConfig(name: string): Observable<SurveyConfig> {
    return this.surveyConfigMap.get(name) ?? EMPTY;
  }

  /**
   * Check if a observable survey config exists for a given name.
   */
  hasSurveyConfig(name: string): Observable<boolean> {
    return of(this.surveyConfigMap.has(name));
  }

  /**
   * Get the names of all observable survey configs.
   */
  getSurveyNames(): Observable<string[]> {
    return of([...this.surveyConfigMap.keys()]);
  }

  /**
   * Survey factory which applies the survey config to a newly created survey instance.
   * Use this function to create survey instances instead of 'new'.
   */
  createSurvey(surveyConfig: SurveyConfig): Survey {
    const survey = new Model(surveyConfig.surveyJson);
    surveyConfig.surveySetupHooks?.forEach((hook) => hook(survey, this.http));
    return survey;
  }
}
