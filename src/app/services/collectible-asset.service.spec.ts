import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CollectibleAssetService } from './collectible-asset.service';
import { COLLECTIBLE_ASSET } from '../mocks/collectible-asset-mock';

describe('CollectibleAssetService', () => {
  let service: CollectibleAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectibleAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAsset() emits the mock collectible asset after the simulated network delay', fakeAsync(() => {
    let result: unknown;
    let emitted = false;
    service.getAsset().subscribe((asset) => {
      result = asset;
      emitted = true;
    });

    expect(emitted).toBeFalse();
    tick(299);
    expect(emitted).toBeFalse();

    tick(1);
    expect(emitted).toBeTrue();
    expect(result).toEqual(COLLECTIBLE_ASSET);
  }));

  it('getAsset() completes after emitting (single-shot observable)', fakeAsync(() => {
    let completed = false;
    service.getAsset().subscribe({ complete: () => (completed = true) });

    tick(300);
    expect(completed).toBeTrue();
  }));
});
