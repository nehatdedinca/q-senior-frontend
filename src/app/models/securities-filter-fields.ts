import { FilterFieldConfig } from './filter-field-config';

/**
 * Maps the `SecuritiesFilter` interface to a `FilterFieldConfig[]` consumed by the generic
 * `FilterBarComponent`. This is the *only* place that couples the generic filter bar to the
 * `SecuritiesFilter` shape - if that interface changes, only this factory needs to change.
 */
export function buildSecuritiesFilterFields(
  types: string[],
  currencies: string[]
): FilterFieldConfig[] {
  return [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Search by name…',
    },
    {
      key: 'types',
      label: 'Type',
      type: 'multiselect',
      options: types.map((type) => ({ value: type, label: type })),
    },
    {
      key: 'currencies',
      label: 'Currency',
      type: 'multiselect',
      options: currencies.map((currency) => ({ value: currency, label: currency })),
    },
    {
      key: 'isPrivate',
      label: 'Visibility',
      type: 'tri-state',
      options: [
        { value: true, label: 'Private' },
        { value: false, label: 'Public' },
      ],
    },
  ];
}
