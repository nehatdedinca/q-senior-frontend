import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal, TrackByFunction} from '@angular/core';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {SelectionModel} from '@angular/cdk/collections';

interface Row {
  id: number;
  title: string;
}

const ROW_COUNT = 50_000;

function createRows(): Row[] {
  return Array.from({length: ROW_COUNT}, (_, i) => i).map(i => ({id: i, title: `Item ${i}`}))
}

@Component({
  selector: 'app-task2',
  imports: [
    CdkVirtualScrollViewport,
    MatCheckbox,
    CdkVirtualForOf,
    CdkFixedSizeVirtualScroll,
    MatButton
  ],
  standalone: true,
  templateUrl: './task2.component.html',
  styleUrls: ['./task2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task2Component {
  rows = signal<Row[]>(createRows())

  /**
   * Selection is tracked by the row's primitive `id` rather than by the `Row` object reference.
   *
   * The original implementation selected `Row` *objects* directly and passed a custom
   * `compareWith: (o1, o2) => o1.id === o2.id` to `SelectionModel` so that rows re-created by
   * "Recreate data" (same `id`, but a brand-new object reference) were still recognised as
   * selected. However, `SelectionModel` can only honour an arbitrary `compareWith` by doing a
   * *linear scan* over the already-selected values for every lookup (see `_getConcreteValue` in
   * `@angular/cdk/collections/selection-model` - there's no way to hash/index an arbitrary
   * comparator). That turns every `isSelected()` / `select()` / `deselect()` call into an O(n)
   * scan, so clicking "Select all" (which calls `select()` once per row) becomes an O(n²)
   * operation - with 50 000 rows that's over a billion comparisons, which is the actual cause of
   * the lag (not virtual scrolling or change detection).
   *
   * Selecting by the row's `id` (a `number`) lets `SelectionModel` fall back to its default,
   * native `Set`-based equality - no `compareWith` needed - which is O(1) per lookup. This keeps
   * exactly the same behaviour (selection survives "Recreate data" because ids are stable across
   * regenerated arrays) while making "Select all" / "Deselect all" O(n) instead of O(n²).
   */
  selectionModel = new SelectionModel<number>(true);
  trackBy: TrackByFunction<Row> = (_, item) => item.id;

  /** Mirrors `selectionModel.selected.length` as a signal so the OnPush view only recomputes it
   *  once per selection change instead of on every change-detection pass. */
  selectedCount = signal(0);

  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    const subscription = this.selectionModel.changed.subscribe(
      () => this.selectedCount.set(this.selectionModel.selected.length)
    );
    this._destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  recreateData() {
    this.rows.set(createRows())
  }

  isSelected(row: Row): boolean {
    return this.selectionModel.isSelected(row.id);
  }

  toggle(row: Row): void {
    this.selectionModel.toggle(row.id);
  }

  selectAll() {
    this.selectionModel.select(...this.rows().map((row) => row.id))
  }

  deselectAll() {
    this.selectionModel.clear();
  }
}

