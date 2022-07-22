import {Injectable} from '@angular/core';
import {WebStorage} from './web-storage';
import {fromEvent, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Injectable()
export class LocalStorageService extends WebStorage {

  constructor() {
    super(window.localStorage);
  }

  observe(key: string): Observable<string | null> {
    return fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter(event => event.key === key),
        map(event => event.newValue)
      );
  }
}
