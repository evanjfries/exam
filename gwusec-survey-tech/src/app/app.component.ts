import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {ActiveSurveyService} from './survey/active-survey.service';
import {Observable} from 'rxjs';
import {Survey} from 'survey-angular';
import {WebcamImage} from 'ngx-webcam';
declare const startVolumeMeter: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit{

  @ViewChild("meter") meter;
  canvasContext: any | null;

  ngAfterViewInit(){
    console.log(this.meter);
    this.canvasContext = this.meter.nativeElement.getContext("2d");
    startVolumeMeter(this.canvasContext);
  }

  isInfoTextCollapsed = true;
  survey$: Observable<Survey | null>;
  public webcamImage: WebcamImage | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private activeSurveyService: ActiveSurveyService,
    private modalService: NgbModal
  ) {
    this.survey$ = this.activeSurveyService.getSurvey();
    // this.ngAfterViewInit();
  }

  openDialog(content: any): void {
    this.modalService.open(content);
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    }
}
