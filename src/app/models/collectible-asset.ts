export interface AssetSlide {
  /** Caption shown on the slide (used as the image `alt` text when `imageUrl` is set). */
  caption: string;
  /** Optional image URL. When omitted, the carousel renders a styled placeholder with `icon`. */
  imageUrl?: string;
  /** Material icon name used for the placeholder when no `imageUrl` is supplied. */
  icon?: string;
}

export interface ValuationPoint {
  year: number;
  value: number;
}

export interface ComparableSale {
  date: string;
  description: string;
  price: number;
  location: string;
  auctionHouse: string;
}

export interface BenchmarkComparison {
  label: string;
  annualizedReturnPct: number;
}

export interface AssetDetailFact {
  label: string;
  value: string;
  icon: string;
}

export interface CollectibleAsset {
  name: string;
  subtitle: string;
  category: string;
  currency: string;
  currentValue: number;
  images: AssetSlide[];
  facts: AssetDetailFact[];
  provenance: string[];
  condition: string;
  valuationHistory: ValuationPoint[];
  comparableSales: ComparableSale[];
  benchmarkComparison: BenchmarkComparison[];
}
