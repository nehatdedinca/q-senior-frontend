import { CollectibleAsset } from '../models/collectible-asset';

/**
 * Entirely fictional demo data for a "high-value collectible asset" dashboard (Task 3).
 * Numbers and provenance are illustrative only - per the task description, accuracy is not
 * important here, so no real auction records, owners or chassis numbers are referenced.
 */
export const COLLECTIBLE_ASSET: CollectibleAsset = {
  name: '1963 Grand Touring Berlinetta',
  subtitle: 'V12 · Coachbuilt · Period Competition History',
  category: 'Classic Automobile',
  currency: 'USD',
  currentValue: 48_500_000,
  images: [
    { caption: 'Front three-quarter view', icon: 'directions_car' },
    { caption: 'Side profile', icon: 'airline_seat_recline_normal' },
    { caption: 'Engine bay', icon: 'settings' },
    { caption: 'Interior & cockpit', icon: 'dashboard' },
  ],
  facts: [
    { label: 'Acquisition date', value: 'March 2015', icon: 'event' },
    { label: 'Acquisition cost', value: '$21,000,000', icon: 'payments' },
    { label: 'Chassis / Serial no.', value: 'GT-0042-SB (demo)', icon: 'fingerprint' },
    { label: 'Condition report', value: 'Concours restored', icon: 'check_circle' },
    { label: 'Coachbuilder', value: 'Scaglietti-style body', icon: 'build' },
    { label: 'Units produced', value: '36 examples', icon: 'format_list_numbered' },
  ],
  provenance: [
    'Delivered new to a private European collector, 1963',
    'Raced in period GT championship events, 1963–1966',
    'Rediscovered and restored to concours condition, 2008–2011',
    'Best of Show, regional concours d\u2019elegance, 2012',
    'Acquired by current owner at private treaty sale, March 2015',
  ],
  condition: 'Concours-restored, matching numbers, period-correct throughout.',
  valuationHistory: [
    { year: 2015, value: 21_000_000 },
    { year: 2016, value: 24_200_000 },
    { year: 2017, value: 27_800_000 },
    { year: 2018, value: 30_100_000 },
    { year: 2019, value: 33_500_000 },
    { year: 2020, value: 32_900_000 },
    { year: 2021, value: 36_700_000 },
    { year: 2022, value: 41_200_000 },
    { year: 2023, value: 44_600_000 },
    { year: 2024, value: 46_800_000 },
    { year: 2025, value: 48_500_000 },
  ],
  comparableSales: [
    {
      date: '2024-08-17',
      description: 'Sister model, chassis GT-0039-SB',
      price: 46_750_000,
      location: 'Monterey, USA',
      auctionHouse: 'Heritage Auctions House',
    },
    {
      date: '2023-02-03',
      description: 'Same series, right-hand drive',
      price: 42_300_000,
      location: 'London, UK',
      auctionHouse: 'Mayfair Collectors Auction',
    },
    {
      date: '2022-05-21',
      description: 'Same series, ex-works competition car',
      price: 51_000_000,
      location: 'Geneva, CH',
      auctionHouse: 'Lakeside Classics',
    },
    {
      date: '2021-10-09',
      description: 'Same series, private treaty sale',
      price: 38_900_000,
      location: 'New York, USA',
      auctionHouse: 'Park Avenue Auctioneers',
    },
    {
      date: '2020-03-14',
      description: 'Same series, barn-find condition',
      price: 29_400_000,
      location: 'Paris, FR',
      auctionHouse: 'Artcurial Motorcars',
    },
  ],
  benchmarkComparison: [
    { label: 'This asset', annualizedReturnPct: 8.3 },
    { label: 'Classic car index', annualizedReturnPct: 6.1 },
    { label: 'Gold', annualizedReturnPct: 4.4 },
    { label: 'S&P 500', annualizedReturnPct: 10.2 },
  ],
};
