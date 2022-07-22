import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export abstract class WebStorage {

  protected constructor(storage: Storage) {
    this.webStorage = storage;
    this.isSupported = WebStorage.storageAvailable(storage);
  }

  private readonly webStorage;
  public readonly isSupported;

  private static storageAvailable(storage: Storage): boolean {
    try {
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        (storage && storage.length !== 0);
    }
  }

  get(key: string): string | null {
    if (this.isSupported) {
      return this.webStorage.getItem(key);
    }
    return null;
  }

  set(key: string, value: string): boolean {
    if (this.isSupported) {
      this.webStorage.setItem(key, value);
      return true;
    }
    return false;
  }

  getObject(key: string): any | null {
      const str = this.get(key);
      return str ? JSON.parse(str) : null;
  }

  setObject(key: string, value: any): boolean {
    return this.set(key, JSON.stringify(value));
  }

  remove(key: string): boolean {
    if (this.isSupported) {
      this.webStorage.removeItem(key);
      return true;
    }
    return false;
  }

  abstract observe(key: string): Observable<string | null>;

  observeObject(key: string): Observable<any | null> {
    return this.observe(key)
      .pipe(
        map(item => item ? JSON.parse(item) : null),
      );
  }
}
