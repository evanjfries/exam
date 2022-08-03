import {Survey, SurveyModel} from 'survey-angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {take} from 'rxjs/operators';

export function surveyToggleNone(params: any[]): string[] {
  const noneItem = params[0];
  const items: any[] = params[1];
  if (items.length > 1 && items.indexOf(noneItem) === 0) {
    return items.slice(1);
  } else {
    return [noneItem];
  }
}

export function renderTextAsHTML(survey: Survey): void {
  survey
    .onTextMarkdown
    .add((survey: any, options: { html: any; text: any; }) => {
      options.html = options.text;
    });
}

export function sendResultsTo(url: string, headers: HttpHeaders | {[name: string]: string | string[]}, partial: boolean = false): (survey: Survey, http: HttpClient) => void {
  return (survey, http) => {
    console.log('sendResultsTo', url, headers, partial);
    const sendResultToServer = (surveyRef: SurveyModel) => {
      const result = surveyRef.data;
      if (result != null) {
        http.post(
          url,
          {survey: result},
          {
            headers
          }
        ).pipe(
          take(1)
        ).subscribe({
            next: () => {
              console.log('sendResultsTo: success');
              // Called on success
            },
            error: () => {
              console.log('sendResultsTo: error');
              // Called on error
            }
          }
        );
      }else{
        console.log('Error', result, result.participant_id);
      }
    };
    survey.onComplete.add(sendResultToServer);

    if (partial) {
      survey.onPartialSend.add(sendResultToServer);
    }
  };
}
