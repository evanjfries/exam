import {Injectable} from '@angular/core';
import {defer, Observable, timer} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

export interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor() { }

  getCountdown(from: number, refreshRate: number = 1000): Observable<number> {
    return defer(() => {
      return timer(0, refreshRate).pipe(
        takeUntil(timer(from)),
        map(x => from - x * refreshRate),
      );
    });
  }
}

export function today(): number {
  return new Date().setHours(0, 0, 0, 0);
}

export function subtractFromDate(date: number | string | Date, subtrahend: Duration): number {
  return _performOperation(date, subtrahend, (a, b) => a - b);
}

export function addToDate(date: number | string | Date, addend: Duration): number {
  return _performOperation(date, addend, (a, b) => a + b);
}

function _performOperation(date: number | string | Date, term: Duration, op: (a: number, b: number) => number): number {
  const result = new Date(date);
  if (term.years) {
    result.setFullYear(op(result.getFullYear(), term.years));
  }
  if (term.months) {
    result.setMonth(op(result.getMonth(), term.months));
  }
  if (term.weeks) {
    result.setDate(op(result.getDate(), (7 * term.weeks)));
  }
  if (term.days) {
    result.setDate(op(result.getDate(), term.days));
  }
  if (term.hours) {
    result.setHours(op(result.getHours(), term.hours));
  }
  if (term.minutes) {
    result.setMinutes(op(result.getMinutes(), term.minutes));
  }
  if (term.seconds) {
    result.setSeconds(op(result.getSeconds(), term.seconds));
  }
  if (term.milliseconds) {
    result.setMilliseconds(op(result.getMilliseconds(), term.milliseconds));
  }
  return result.valueOf();
}

export function daysToMilliseconds(duration: Duration): number {
  return (duration.milliseconds || 0)
    + 1000 * ((duration.seconds || 0)
      + 60 * ((duration.minutes || 0)
        + 60 * ((duration.hours || 0)
          + 24 * (duration.days || 0))));
}

export function millisecondsToDays(timestamp: number): Duration {
  const days = Math.floor(timestamp / (1000 * 60 * 60 * 24));
  const hours = Math.floor(timestamp / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(timestamp / (1000 * 60)) % 60;
  const seconds = Math.floor(timestamp / 1000) % 60;
  const milliseconds = timestamp % 1000;

  let result: Duration = {};
  if (days !== 0) {
    result.days = days;
  }
  if (hours !== 0) {
    result.hours = hours;
  }
  if (minutes !== 0) {
    result.minutes = minutes;
  }
  if (seconds !== 0) {
    result.seconds = seconds;
  }
  if (milliseconds !== 0) {
    result.milliseconds = milliseconds;
  }
  return result;
  // return {days, hours, minutes, seconds, milliseconds};
}

export function differenceInDays(a: number | string | Date, b: number | string | Date): Duration {
  return millisecondsToDays(toUTC(a) - toUTC(b));
}

export function toUTC(date: number | string | Date): number {
  const d = new Date(date);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}

export function daysToString(duration: Duration): string {
  let result = (duration.seconds ?? 0) + 's';
  result = duration.minutes != null ? duration.minutes + 'm ' + result : result;
  result = duration.hours != null ? duration.hours + 'h ' + result : result;
  result = duration.days != null ? duration.days + 'd ' + result : result;

  return result;
}
