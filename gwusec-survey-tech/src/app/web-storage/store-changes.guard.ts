import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

export interface ComponentStoreChange {
  storeChanges(): Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class StoreChangesGuard implements CanDeactivate<ComponentStoreChange> {
  canDeactivate(
    component: ComponentStoreChange,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component?.storeChanges ? component.storeChanges() : true;
  }

}
