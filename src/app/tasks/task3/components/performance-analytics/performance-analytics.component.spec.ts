import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PerformanceAnalyticsComponent } from './performance-analytics.component';
import { CollectibleAsset } from '../../../../models/collectible-asset';
import { TrendChartComponent } from '../../../../components/trend-chart/trend-chart.component';

const ASSET: CollectibleAsset = {
  name: 'Demo Asset',
  subtitle: '',
  category: 'Classic Automobile',
  currency: 'USD',
  currentValue: 40_000_000,
  images: [],
  facts: [],
  provenance: [],
  condition: '',
  valuationHistory: [
    { year: 2015, value: 20_000_000 },
    { year: 2020, value: 30_000_000 },
    { year: 2025, value: 40_000_000 },
  ],
  comparableSales: [],
  benchmarkComparison: [
    { label: 'This asset', annualizedReturnPct: 7.2 },
    { label: 'Gold', annualizedReturnPct: 4.4 },
  ],
};

describe('PerformanceAnalyticsComponent', () => {
  let fixture: ComponentFixture<PerformanceAnalyticsComponent>;
  let component: PerformanceAnalyticsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceAnalyticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PerformanceAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('asset', ASSET);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('computes total return as the percentage change from first to last valuation point', () => {
    // (40M - 20M) / 20M * 100 = 100%
    expect(component['totalReturnPct']()).toBeCloseTo(100, 5);
  });

  it('computes CAGR across the full span of years between the first and last point', () => {
    // (40M/20M)^(1/10) - 1, expressed as a percentage
    const expected = (Math.pow(40_000_000 / 20_000_000, 1 / 10) - 1) * 100;
    expect(component['cagrPct']()).toBeCloseTo(expected, 5);
  });

  it('computes unrealized gain as last minus first valuation', () => {
    expect(component['unrealizedGain']()).toBe(20_000_000);
  });

  it('returns 0 CAGR when first/last valuation years are equal (guards divide-by-zero)', () => {
    fixture.componentRef.setInput('asset', {
      ...ASSET,
      valuationHistory: [
        { year: 2021, value: 10 },
        { year: 2020, value: 20 },
      ],
    });
    fixture.detectChanges();
    expect(component['cagrPct']()).toBe(0);
  });

  it('maps valuationHistory to chart points labeled by year', () => {
    expect(component['valuationPoints']()).toEqual([
      { label: '2015', value: 20_000_000 },
      { label: '2020', value: 30_000_000 },
      { label: '2025', value: 40_000_000 },
    ]);
  });

  it('maps benchmarkComparison to chart points labeled by benchmark name', () => {
    expect(component['benchmarkPoints']()).toEqual([
      { label: 'This asset', value: 7.2 },
      { label: 'Gold', value: 4.4 },
    ]);
  });

  it('formats currency values compactly (e.g. $40M)', () => {
    expect(component['currencyFormatter'](40_000_000)).toBe('$40M');
  });

  it('formats percentages with one decimal place and a trailing %', () => {
    expect(component['percentFormatter'](7.2)).toBe('7.2%');
  });

  it('renders the four KPI cards with their computed values', () => {
    const kpis = fixture.debugElement.queryAll(By.css('.kpi'));
    expect(kpis.length).toBe(4);

    const labels = kpis.map((k) => k.query(By.css('.kpi__label')).nativeElement.textContent.trim());
    expect(labels).toEqual(['Current value', 'Total return', 'CAGR', 'Unrealized gain']);

    const currentValue = kpis[0].query(By.css('.kpi__value')).nativeElement.textContent.trim();
    expect(currentValue).toBe('$40M');
  });

  it('renders two trend-chart instances: a valuation area chart and a benchmark bar chart', () => {
    const charts = fixture.debugElement.queryAll(By.directive(TrendChartComponent));
    expect(charts.length).toBe(2);

    const [valuationChart, benchmarkChart] = charts.map((c) => c.componentInstance as TrendChartComponent);
    expect(valuationChart.type()).toBe('area');
    expect(benchmarkChart.type()).toBe('bar');
  });

  it('renders the chart section titles', () => {
    const titles = fixture.debugElement
      .queryAll(By.css('.performance__chart-title'))
      .map((t) => t.nativeElement.textContent.trim());
    expect(titles).toEqual(['Valuation over time', 'Annualized return vs. benchmarks']);
  });
});
