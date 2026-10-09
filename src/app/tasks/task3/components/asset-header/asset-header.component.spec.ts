import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AssetHeaderComponent } from './asset-header.component';
import { CollectibleAsset } from '../../../../models/collectible-asset';
import { CarouselComponent } from '../../../../components/carousel/carousel.component';

const ASSET: CollectibleAsset = {
  name: '1963 Grand Touring Berlinetta',
  subtitle: 'V12 · Coachbuilt · Period Competition History',
  category: 'Classic Automobile',
  currency: 'USD',
  currentValue: 48_500_000,
  images: [{ caption: 'Front', icon: 'directions_car' }],
  facts: [],
  provenance: [],
  condition: '',
  valuationHistory: [{ year: 2015, value: 1 }],
  comparableSales: [],
  benchmarkComparison: [],
};

describe('AssetHeaderComponent', () => {
  let fixture: ComponentFixture<AssetHeaderComponent>;
  let component: AssetHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetHeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('asset', ASSET);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the category, name and subtitle', () => {
    const category = fixture.debugElement.query(By.css('.asset-header__category'));
    const name = fixture.debugElement.query(By.css('.asset-header__name'));
    const subtitle = fixture.debugElement.query(By.css('.asset-header__subtitle'));

    expect(category.nativeElement.textContent.trim()).toBe('Classic Automobile');
    expect(name.nativeElement.textContent.trim()).toBe('1963 Grand Touring Berlinetta');
    expect(subtitle.nativeElement.textContent.trim()).toBe(
      'V12 · Coachbuilt · Period Competition History'
    );
  });

  it('formats the current value as a whole-number currency amount', () => {
    const value = fixture.debugElement.query(By.css('.asset-header__value-amount'));
    expect(value.nativeElement.textContent.trim()).toBe('$48,500,000');
  });

  it('passes the asset images down to the carousel', () => {
    const carousel = fixture.debugElement.query(By.directive(CarouselComponent))
      .componentInstance as CarouselComponent;
    expect(carousel.slides()).toEqual(ASSET.images);
  });

  it('re-renders the formatted value when the asset input changes', () => {
    fixture.componentRef.setInput('asset', { ...ASSET, currentValue: 1_000, currency: 'EUR' });
    fixture.detectChanges();

    const value = fixture.debugElement.query(By.css('.asset-header__value-amount'));
    expect(value.nativeElement.textContent.trim()).toBe('€1,000');
  });
});
