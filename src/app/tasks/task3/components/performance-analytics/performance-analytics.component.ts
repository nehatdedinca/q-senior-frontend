import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CollectibleAsset } from '../../../../models/collectible-asset';
import { TrendChartComponent, ChartPoint } from '../../../../components/trend-chart/trend-chart.component';

/** Compact axis-friendly currency label, e.g. 48_500_000 -> "$48.5M". */
function formatCompactCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

@Component({
  selector: 'app-performance-analytics',
  standalone: true,
  imports: [MatCardModule, DecimalPipe, TrendChartComponent],
  templateUrl: './performance-analytics.component.html',
  styleUrl: './performance-analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceAnalyticsComponent {
  asset = input.required<CollectibleAsset>();

  protected valuationPoints = computed<ChartPoint[]>(() =>
    this.asset().valuationHistory.map((p) => ({ label: `${p.year}`, value: p.value }))
  );

  protected benchmarkPoints = computed<ChartPoint[]>(() =>
    this.asset().benchmarkComparison.map((b) => ({ label: b.label, value: b.annualizedReturnPct }))
  );

  protected totalReturnPct = computed(() => {
    const history = this.asset().valuationHistory;
    const first = history[0].value;
    const last = history[history.length - 1].value;
    return ((last - first) / first) * 100;
  });

  protected cagrPct = computed(() => {
    const history = this.asset().valuationHistory;
    const first = history[0];
    const last = history[history.length - 1];
    const years = last.year - first.year;
    if (years <= 0) return 0;
    return (Math.pow(last.value / first.value, 1 / years) - 1) * 100;
  });

  protected unrealizedGain = computed(() => {
    const history = this.asset().valuationHistory;
    return history[history.length - 1].value - history[0].value;
  });

  protected currencyFormatter = (value: number): string =>
    formatCompactCurrency(value, this.asset().currency);

  protected percentFormatter = (value: number): string => `${value.toFixed(1)}%`;
}
