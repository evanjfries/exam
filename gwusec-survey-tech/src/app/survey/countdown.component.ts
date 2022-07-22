import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {SurveyValueInput, SurveyValueOutput, SurveyWidget} from './survey.widget';
import {finalize, Observable, tap} from 'rxjs';
import {daysToMilliseconds, Duration, millisecondsToDays, TimerService} from './timer.service';
import {map, shareReplay} from 'rxjs/operators';


@Component({
  selector: 'app-countdown',
  template: `
    <ng-container *ngIf="(countdown$ | async) as c; else countdownDone">
      <div class="alert alert-primary">
        <ng-container *ngIf="messages && messages.running">
          {{messages.running}}
        </ng-container>
        (Time left:
        <ng-container *ngIf="c.days"><span>{{c.days}}</span><span>d </span></ng-container>
        <ng-container *ngIf="c.hours"><span>{{c.hours}}</span><span>h </span></ng-container>
        <ng-container *ngIf="c.minutes"><span>{{c.minutes}}</span><span>min </span></ng-container>
        <ng-container><span>{{c.seconds}}</span><span>s</span></ng-container>
        )
      </div>
    </ng-container>

    <ng-template #countdownDone>
      <div class="alert alert-success" *ngIf="messages && messages.timeUp">
        {{messages.timeUp}}
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
@SurveyWidget({
  name: 'countdown'
})
export class CountdownComponent implements OnChanges {

  @SurveyValueOutput() @Output() readonly timeChange = new EventEmitter<number>();
  @SurveyValueInput() @Input() time?: number;

  @Input() duration?: Duration;

  @Input() messages?: { running?: string, timeUp?: string };

  countdown$?: Observable<Duration>;

  constructor(private _timerService: TimerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.duration != null && this.duration != null && this.time !== 0) {
      this.countdown$ = this._timerService
        .getCountdown(this.time || daysToMilliseconds(this.duration), 1000)
        .pipe(
          tap(x => this.timeChange.emit(x)),
          map(x => millisecondsToDays(x)),
          finalize(() => {
            this.timeChange.emit(0);
            this.countdown$ = undefined;
          }),
          shareReplay(1)
        );
    }
  }
}
