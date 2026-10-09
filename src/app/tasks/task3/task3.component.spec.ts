import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Task3Component } from './task3.component';
import { CollectibleAssetService } from '../../services/collectible-asset.service';
import { COLLECTIBLE_ASSET } from '../../mocks/collectible-asset-mock';
import { AssetHeaderComponent } from './components/asset-header/asset-header.component';
import { AssetDetailsComponent } from './components/asset-details/asset-details.component';
import { PerformanceAnalyticsComponent } from './components/performance-analytics/performance-analytics.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';

describe('Task3Component', () => {
  let fixture: ComponentFixture<Task3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task3Component],
    }).compileComponents();
  });

  function createComponent(): ComponentFixture<Task3Component> {
    return TestBed.createComponent(Task3Component);
  }

  it('should create', () => {
    fixture = createComponent();
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows a loading spinner before the asset has resolved', () => {
    fixture = createComponent();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(AssetHeaderComponent))).toBeFalsy();
  });

  it('renders the full dashboard once the asset resolves, and hides the spinner', fakeAsync(() => {
    fixture = createComponent();
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeFalsy();
    expect(fixture.debugElement.query(By.directive(AssetHeaderComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(AssetDetailsComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(PerformanceAnalyticsComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(TransactionHistoryComponent))).toBeTruthy();
    discardPeriodicTasks(); // app-asset-header's carousel runs a default 5s autoplay interval
  }));

  it('passes the resolved asset down to every section component', fakeAsync(() => {
    fixture = createComponent();
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.directive(AssetHeaderComponent))
      .componentInstance as AssetHeaderComponent;
    const details = fixture.debugElement.query(By.directive(AssetDetailsComponent))
      .componentInstance as AssetDetailsComponent;

    expect(header.asset()).toEqual(COLLECTIBLE_ASSET);
    expect(details.asset()).toEqual(COLLECTIBLE_ASSET);
    discardPeriodicTasks();
  }));

  it('renders the demo-data disclaimer', fakeAsync(() => {
    fixture = createComponent();
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const disclaimer = fixture.debugElement.query(By.css('.dashboard__disclaimer'));
    expect(disclaimer.nativeElement.textContent).toContain('Demo data');
    discardPeriodicTasks();
  }));

  it('requests the asset from CollectibleAssetService exactly once', () => {
    const service = TestBed.inject(CollectibleAssetService);
    spyOn(service, 'getAsset').and.callThrough();

    fixture = createComponent();
    fixture.detectChanges();

    expect(service.getAsset).toHaveBeenCalledTimes(1);
  });
});
