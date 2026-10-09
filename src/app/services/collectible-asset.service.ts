import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { CollectibleAsset } from '../models/collectible-asset';
import { COLLECTIBLE_ASSET } from '../mocks/collectible-asset-mock';

@Injectable({
  providedIn: 'root',
})
export class CollectibleAssetService {
  /**
   * Get collectible asset dashboard data mock. Mirrors `SecurityService`'s shape so the
   * dashboard can later be pointed at a real backend without touching its components.
   * */
  getAsset(): Observable<CollectibleAsset> {
    return of(COLLECTIBLE_ASSET).pipe(delay(300));
  }
}
