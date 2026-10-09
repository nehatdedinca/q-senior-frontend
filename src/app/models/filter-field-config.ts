/**
 * Supported input widgets the generic {@link FilterBarComponent} knows how to render.
 * Extend this union (and the template's `@switch`) when a new widget type is required -
 * no other part of the filter bar needs to change.
 */
export type FilterFieldType =
  | 'text'
  | 'select'
  | 'multiselect'
  | 'tri-state'
  | 'boolean';

export interface FilterFieldOption<TValue = unknown> {
  value: TValue;
  label: string;
}

/**
 * Describes a single filter input. A list of these fully configures the
 * {@link FilterBarComponent} and is the only thing that needs to change when the
 * filter interface it serves is extended.
 */
export interface FilterFieldConfig<TValue = unknown> {
  /** Property name on the resulting filter object, e.g. `'name'` for `SecuritiesFilter.name`. */
  key: string;
  label: string;
  type: FilterFieldType;
  /** Required for 'select' | 'multiselect' | 'tri-state'. */
  options?: FilterFieldOption<TValue>[];
  placeholder?: string;
}
