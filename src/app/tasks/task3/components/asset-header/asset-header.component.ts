import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CollectibleAsset } from '../../../../models/collectible-asset';
import { CarouselComponent } from '../../../../components/carousel/carousel.component';

@Component({
  selector: 'app-asset-header',
  standalone: true,
  imports: [CurrencyPipe, CarouselComponent],
  templateUrl: './asset-header.component.html',
  styleUrl: './asset-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetHeaderComponent {
  asset = input.required<CollectibleAsset>();
}
