import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CollectibleAsset } from '../../../../models/collectible-asset';

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [MatIconModule, MatCardModule],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetDetailsComponent {
  asset = input.required<CollectibleAsset>();
}
