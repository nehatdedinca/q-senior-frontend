import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TransactionHistoryComponent } from './transaction-history.component';
import { CollectibleAsset } from '../../../../models/collectible-asset';

const ASSET: CollectibleAsset = {
  name: 'Demo Asset',
  subtitle: '',
  category: 'Classic Automobile',
  currency: 'USD',
  currentValue: 1,
  images: [],
  facts: [],
  provenance: [],
  condition: '',
  valuationHistory: [{ year: 2015, value: 1 }],
  comparableSales: [
    {
      date: '2024-08-17',
      description: 'Sister model, chassis GT-0039-SB',
      price: 46_750_000,
      location: 'Monterey, USA',
      auctionHouse: 'Heritage Auctions House',
    },
    {
      date: '2023-05-02',
      description: 'Comparable example',
      price: 41_200_000,
      location: 'Geneva, Switzerland',
      auctionHouse: 'Bonhams',
    },
  ],
  benchmarkComparison: [],
};

describe('TransactionHistoryComponent', () => {
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let component: TransactionHistoryComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('asset', ASSET);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the Date/Description/Auction House/Location/Sale Price column headers', () => {
    const headers = fixture.debugElement
      .queryAll(By.css('th'))
      .map((h) => h.nativeElement.textContent.trim());
    expect(headers).toEqual(['Date', 'Description', 'Auction House', 'Location', 'Sale Price']);
  });

  it('renders one row per comparable sale, in order', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr[mat-row], tbody tr.mat-row'));
    expect(rows.length).toBe(2);
  });

  it('formats the date, description, auction house, location and price for each row', () => {
    const firstRowCells = fixture.debugElement
      .queryAll(By.css('tbody tr:first-child td'))
      .map((c) => c.nativeElement.textContent.trim());

    expect(firstRowCells[1]).toBe('Sister model, chassis GT-0039-SB');
    expect(firstRowCells[2]).toBe('Heritage Auctions House');
    expect(firstRowCells[3]).toBe('Monterey, USA');
    expect(firstRowCells[4]).toBe('$46,750,000');
  });

  it('renders no rows when there are no comparable sales', () => {
    fixture.componentRef.setInput('asset', { ...ASSET, comparableSales: [] });
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr[mat-row], tbody tr.mat-row'));
    expect(rows.length).toBe(0);
  });
});
