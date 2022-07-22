import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackFormComponent {

  feedbackSubmitted: boolean = false;

  @Input() withdrawn: boolean = false;

  model = {
    feedback: ''
  }

  constructor() {}

  submitFeedback(): void {
    if (this.model.feedback.length > 0) {
      this.feedbackSubmitted = true;
    }
  }
}
