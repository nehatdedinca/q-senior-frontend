import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AssetDetailsComponent } from './asset-details.component';
import { CollectibleAsset } from '../../../../models/collectible-asset';

const ASSET: CollectibleAsset = {
  name: 'Demo Asset',
  subtitle: 'Demo subtitle',
  category: 'Classic Automobile',
  currency: 'USD',
  currentValue: 1,
  images: [],
  facts: [
    { label: 'Acquisition date', value: 'March 2015', icon: 'event' },
    { label: 'Chassis / Serial no.', value: 'GT-0042-SB (demo)', icon: 'fingerprint' },
  ],
  provenance: ['First owner, 1963', 'Restored, 2010'],
  condition: 'Concours-restored, matching numbers.',
  valuationHistory: [{ year: 2015, value: 1 }],
  comparableSales: [],
  benchmarkComparison: [],
};

describe('AssetDetailsComponent', () => {
  let fixture: ComponentFixture<AssetDetailsComponent>;
  let component: AssetDetailsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('asset', ASSET);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one fact row per entry in asset.facts, with icon/label/value', () => {
    const facts = fixture.debugElement.queryAll(By.css('.fact'));
    expect(facts.length).toBe(ASSET.facts.length);

    const firstLabel = facts[0].query(By.css('.fact__label'));
    const firstValue = facts[0].query(By.css('.fact__value'));
    expect(firstLabel.nativeElement.textContent.trim()).toBe('Acquisition date');
    expect(firstValue.nativeElement.textContent.trim()).toBe('March 2015');
  });

  it('renders the condition report text', () => {
    const condition = fixture.debugElement.query(By.css('.asset-details__condition span'));
    expect(condition.nativeElement.textContent.trim()).toBe(
      'Concours-restored, matching numbers.'
    );
  });

  it('renders provenance entries as an ordered list, in order', () => {
    const items = fixture.debugElement.queryAll(By.css('.asset-details__provenance li'));
    expect(items.length).toBe(2);
    expect(items[0].nativeElement.textContent.trim()).toBe('First owner, 1963');
    expect(items[1].nativeElement.textContent.trim()).toBe('Restored, 2010');
  });

  it('renders no fact rows and no provenance items when both are empty', () => {
    fixture.componentRef.setInput('asset', { ...ASSET, facts: [], provenance: [] });
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.fact')).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.css('.asset-details__provenance li')).length).toBe(0);
  });
});
