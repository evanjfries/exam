import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-pretest',
  templateUrl: './pretest.component.html',
  styleUrls: ['./pretest.component.scss']
})
export class PretestComponent implements OnInit {
  currentStep = 0;
  public webcamImage: WebcamImage | null;
  webcamOn = false;
  tabs: string[] = ['active', '', '', ''];

  constructor() { }

  ngOnInit(): void {
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    }
  
  next() {
    this.tabs[this.currentStep] = '';
    this.currentStep++;
    this.tabs[this.currentStep] = 'active';
    this.webcamOn = false;
    this.webcamImage = null;
  }

  startWebcam() {
    this.webcamOn = true;
}
}
