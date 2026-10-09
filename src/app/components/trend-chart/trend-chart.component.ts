import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface ChartPoint {
  label: string;
  value: number;
}

interface PlottedPoint extends ChartPoint {
  x: number;
  y: number;
}

interface PlottedBar extends ChartPoint {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GridLine {
  y: number;
  label: string;
}

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 260;
const PADDING = { top: 16, right: 16, bottom: 28, left: 16 };

/**
 * Minimal, dependency-free SVG line/area/bar chart. Generic over `ChartPoint[]` so it has no
 * knowledge of `CollectibleAsset` and can be reused for any label/value series.
 */
@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [],
  templateUrl: './trend-chart.component.html',
  styleUrl: './trend-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendChartComponent {
  points = input.required<ChartPoint[]>();
  type = input<'area' | 'bar'>('area');
  color = input('#c9a227');
  valueFormatter = input<(value: number) => string>((value) => `${value}`);

  protected readonly viewBox = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;
  protected readonly plotWidth = VIEW_WIDTH - PADDING.left - PADDING.right;
  protected readonly plotHeight = VIEW_HEIGHT - PADDING.top - PADDING.bottom;
  protected readonly baselineY = PADDING.top + this.plotHeight;

  private readonly _bounds = computed(() => {
    const values = this.points().map((p) => p.value);
    const min = this.type() === 'bar' ? 0 : Math.min(...values) * 0.9;
    const max = Math.max(...values) * 1.05;
    return { min, max: max > min ? max : min + 1 };
  });

  protected readonly gridLines = computed<GridLine[]>(() => {
    const { min, max } = this._bounds();
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const value = min + ((max - min) * i) / steps;
      return { y: this._scaleY(value), label: this.valueFormatter()(Math.round(value)) };
    }).reverse();
  });

  protected readonly plottedPoints = computed<PlottedPoint[]>(() => {
    const data = this.points();
    const step = data.length > 1 ? this.plotWidth / (data.length - 1) : 0;
    return data.map((point, i) => ({
      ...point,
      x: PADDING.left + i * step,
      y: this._scaleY(point.value),
    }));
  });

  protected readonly linePath = computed(() =>
    this.plottedPoints()
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
      .join(' ')
  );

  protected readonly areaPath = computed(() => {
    const plotted = this.plottedPoints();
    if (!plotted.length) return '';
    const last = plotted[plotted.length - 1];
    const first = plotted[0];
    return `${this.linePath()} L${last.x},${this.baselineY} L${first.x},${this.baselineY} Z`;
  });

  protected readonly bars = computed<PlottedBar[]>(() => {
    const data = this.points();
    const slotWidth = this.plotWidth / data.length;
    const barWidth = slotWidth * 0.55;
    return data.map((point, i) => {
      const y = this._scaleY(point.value);
      return {
        ...point,
        x: PADDING.left + i * slotWidth + (slotWidth - barWidth) / 2,
        y,
        width: barWidth,
        height: this.baselineY - y,
      };
    });
  });

  private _scaleY(value: number): number {
    const { min, max } = this._bounds();
    const ratio = (value - min) / (max - min);
    return PADDING.top + this.plotHeight - ratio * this.plotHeight;
  }
}
