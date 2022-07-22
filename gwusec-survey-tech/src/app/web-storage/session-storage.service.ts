import {Injectable} from '@angular/core';
import {WebStorage} from './web-storage';
import {Observable} from 'rxjs';

@Injectable()
export class SessionStorageService extends WebStorage{

  constructor() {
    super(window.sessionStorage);
  }

  observe(key: string): Observable<string | null> {
    throw new Error('Not implemented - SessionStorage does not have build-in means to observe changes.');
  }
}
