import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { CollectibleAsset } from '../../models/collectible-asset';
import { CollectibleAssetService } from '../../services/collectible-asset.service';
import { AssetHeaderComponent } from './components/asset-header/asset-header.component';
import { AssetDetailsComponent } from './components/asset-details/asset-details.component';
import { PerformanceAnalyticsComponent } from './components/performance-analytics/performance-analytics.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';

@Component({
  selector: 'app-task3',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinnerModule,
    AssetHeaderComponent,
    AssetDetailsComponent,
    PerformanceAnalyticsComponent,
    TransactionHistoryComponent,
  ],
  templateUrl: './task3.component.html',
  styleUrl: './task3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task3Component {
  private readonly _assetService = inject(CollectibleAssetService);

  protected asset$: Observable<CollectibleAsset> = this._assetService.getAsset();
}
