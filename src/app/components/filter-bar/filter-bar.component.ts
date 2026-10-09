import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { merge, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilterFieldConfig } from '../../models/filter-field-config';

/**
 * Generic, config-driven filter bar.
 *
 * It has **no knowledge** of any concrete filter interface (e.g. `SecuritiesFilter`) or of
 * the component(s) that will consume its output (e.g. `FilterableTableComponent`). Callers
 * supply a `FilterFieldConfig[]` describing which inputs to render, and the bar emits a
 * cleaned, partial filter object of type `T` whenever the user changes a value.
 *
 * This makes it reusable for any filter interface: when a filter interface grows or
 * shrinks, only the field-config (and nothing in this component) needs to change.
 */
@Component({
  selector: 'filter-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent<T extends object = Record<string, unknown>>
  implements OnChanges, OnDestroy
{
  /** Describes which inputs to render and which key each maps to on the emitted filter. */
  @Input({ required: true }) fields: FilterFieldConfig[] = [];

  /** Values to seed the form with, e.g. filter state restored from the URL. */
  @Input() initialValue: Partial<T> = {};

  /** Debounce applied to user input before a new filter value is emitted. */
  @Input() debounceMs = 300;

  /** Emits a cleaned (no empty/undefined/empty-array entries) partial filter of type `T`. */
  @Output() filterChange = new EventEmitter<Partial<T>>();

  private readonly _fb = inject(FormBuilder);
  private readonly _rebuild$ = new Subject<void>();
  private readonly _destroy$ = new Subject<void>();

  protected form: FormGroup = this._fb.group({});

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this._buildForm();
    }
  }

  ngOnDestroy(): void {
    this._rebuild$.next();
    this._rebuild$.complete();
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected reset(): void {
    const defaults: Record<string, unknown> = {};
    for (const field of this.fields) {
      defaults[field.key] = this._defaultValueFor(field);
    }
    this.form.reset(defaults);
  }

  private _buildForm(): void {
    // Stop the previous form's subscription before rebuilding.
    this._rebuild$.next();

    const controls: Record<string, unknown> = {};
    for (const field of this.fields) {
      const seeded = (this.initialValue as Record<string, unknown> | undefined)?.[field.key];
      controls[field.key] = seeded ?? this._defaultValueFor(field);
    }
    this.form = this._fb.group(controls);

    // Emit the (cleaned) initial value immediately, then emit again - debounced - whenever
    // the user changes something.
    merge(of(this.form.value), this.form.valueChanges.pipe(debounceTime(this.debounceMs)))
      .pipe(
        map((value) => this._cleanValue(value)),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this._rebuild$),
        takeUntil(this._destroy$)
      )
      .subscribe((value) => this.filterChange.emit(value));
  }

  private _defaultValueFor(field: FilterFieldConfig): unknown {
    switch (field.type) {
      case 'multiselect':
        return [];
      case 'boolean':
        return false;
      case 'select':
      case 'tri-state':
        return null;
      case 'text':
      default:
        return '';
    }
  }

  /** Strips empty strings, null/undefined and empty arrays so the emitted filter only
   *  contains keys the caller actually wants to filter by. */
  private _cleanValue(raw: Record<string, unknown>): Partial<T> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(raw)) {
      if (value === null || value === undefined || value === '') continue;
      if (Array.isArray(value) && value.length === 0) continue;
      result[key] = value;
    }
    return result as Partial<T>;
  }
}
