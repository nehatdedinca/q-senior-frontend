import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { AssetSlide } from '../../models/collectible-asset';

/**
 * Small, generic image/slide carousel. It knows nothing about `CollectibleAsset` beyond the
 * minimal `AssetSlide` shape (caption + optional image/icon), so it can be reused for any
 * gallery of slides elsewhere in the app.
 */
@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatIconModule, MatIconButton],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent {
  slides = input.required<AssetSlide[]>();
  /** Autoplay interval in ms; set to 0 to disable autoplay. */
  autoplayMs = input(5000);

  protected activeIndex = signal(0);
  protected activeSlide = computed(() => this.slides()[this.activeIndex()] ?? null);

  private readonly _paused = signal(false);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    const intervalMs = this.autoplayMs();
    if (intervalMs > 0) {
      const timer = setInterval(() => {
        if (this._paused() || this.slides().length <= 1) return;
        this.next();
      }, intervalMs);
      this._destroyRef.onDestroy(() => clearInterval(timer));
    }
  }

  protected goTo(index: number): void {
    this.activeIndex.set(index);
  }

  protected next(): void {
    const total = this.slides().length;
    this.activeIndex.update((i) => (i + 1) % total);
  }

  protected previous(): void {
    const total = this.slides().length;
    this.activeIndex.update((i) => (i - 1 + total) % total);
  }

  protected pause(): void {
    this._paused.set(true);
  }

  protected resume(): void {
    this._paused.set(false);
  }
}
