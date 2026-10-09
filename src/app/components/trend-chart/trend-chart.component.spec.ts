import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChartPoint, TrendChartComponent } from './trend-chart.component';

describe('TrendChartComponent', () => {
  let fixture: ComponentFixture<TrendChartComponent>;
  let component: TrendChartComponent;

  const points: ChartPoint[] = [
    { label: '2015', value: 100 },
    { label: '2016', value: 150 },
    { label: '2017', value: 120 },
    { label: '2018', value: 200 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrendChartComponent);
    component = fixture.componentInstance;
  });

  function setPoints(data: ChartPoint[], type: 'area' | 'bar' = 'area'): void {
    fixture.componentRef.setInput('points', data);
    fixture.componentRef.setInput('type', type);
    fixture.detectChanges();
  }

  it('should create', () => {
    setPoints(points);
    expect(component).toBeTruthy();
  });

  it('exposes a fixed viewBox matching the SVG coordinate space', () => {
    setPoints(points);
    expect(component['viewBox']).toBe('0 0 600 260');
  });

  it('plots one point per data item, spaced evenly across the plot width', () => {
    setPoints(points);
    const plotted = component['plottedPoints']();

    expect(plotted.length).toBe(points.length);
    expect(plotted[0].x).toBe(16); // left padding
    expect(plotted[plotted.length - 1].x).toBeCloseTo(600 - 16, 5); // right padding
  });

  it('scales the y position so the highest value is near the top of the plot area', () => {
    setPoints(points);
    const plotted = component['plottedPoints']();
    const maxValuePoint = plotted.find((p) => p.value === 200)!;
    const minValuePoint = plotted.find((p) => p.value === 100)!;

    // Higher value -> smaller y (SVG y grows downward).
    expect(maxValuePoint.y).toBeLessThan(minValuePoint.y);
  });

  it('builds a line path starting with M and continuing with L commands for an area chart', () => {
    setPoints(points, 'area');
    const linePath = component['linePath']();

    expect(linePath.startsWith('M')).toBeTrue();
    expect(linePath.match(/L/g)?.length).toBe(points.length - 1);
  });

  it('closes the area path down to the baseline, forming a filled region', () => {
    setPoints(points, 'area');
    const areaPath = component['areaPath']();

    expect(areaPath).toContain('Z');
    expect(areaPath).toContain(`${component['baselineY']}`);
  });

  it('renders an <path class="chart__area"> and a line for type="area"', () => {
    setPoints(points, 'area');

    expect(fixture.debugElement.query(By.css('path.chart__area'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('path.chart__line'))).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.css('circle.chart__point')).length).toBe(points.length);
  });

  it('renders <rect class="chart__bar"> elements for type="bar", one per data point', () => {
    setPoints(points, 'bar');

    const bars = fixture.debugElement.queryAll(By.css('rect.chart__bar'));
    expect(bars.length).toBe(points.length);
    expect(fixture.debugElement.query(By.css('path.chart__area'))).toBeFalsy();
  });

  it('bar chart always anchors its scale minimum at 0, regardless of data minimum', () => {
    setPoints(
      [
        { label: 'a', value: 50 },
        { label: 'b', value: 80 },
      ],
      'bar'
    );
    const bars = component['bars']();

    // Bar height should equal baselineY - y (i.e. grows from y=0 value upward).
    for (const bar of bars) {
      expect(bar.height).toBeCloseTo(component['baselineY'] - bar.y, 5);
    }
  });

  it('formats grid line and axis labels using the provided valueFormatter', () => {
    fixture.componentRef.setInput('points', points);
    fixture.componentRef.setInput('valueFormatter', (v: number) => `$${v}`);
    fixture.detectChanges();

    const gridLines = component['gridLines']();
    expect(gridLines.length).toBe(5); // 4 steps + 1
    expect(gridLines.every((g) => g.label.startsWith('$'))).toBeTrue();
  });

  it('defaults to a simple string formatter when none is provided', () => {
    setPoints(points);
    expect(component.valueFormatter()(42)).toBe('42');
  });

  it('applies the provided color to area/line/bar fills', () => {
    setPoints(points, 'area');
    fixture.componentRef.setInput('color', '#ff0000');
    fixture.detectChanges();

    const area = fixture.debugElement.query(By.css('path.chart__area'));
    expect(area.nativeElement.getAttribute('fill')).toBe('#ff0000');
  });

  it('handles a single data point without throwing (zero-width step)', () => {
    expect(() => setPoints([{ label: 'only', value: 10 }])).not.toThrow();
    const plotted = component['plottedPoints']();
    expect(plotted.length).toBe(1);
    expect(plotted[0].x).toBe(16);
  });

  it('avoids a zero-height domain when all values are identical', () => {
    setPoints([
      { label: 'a', value: 100 },
      { label: 'b', value: 100 },
    ]);
    const gridLines = component['gridLines']();

    // Should produce distinct y positions for the grid lines (non-degenerate scale).
    const ys = new Set(gridLines.map((g) => g.y));
    expect(ys.size).toBeGreaterThan(1);
  });
});
