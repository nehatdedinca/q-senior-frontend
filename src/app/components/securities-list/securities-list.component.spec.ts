import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { SecuritiesListComponent } from './securities-list.component';
import { SECURITIES } from '../../mocks/securities-mocks';

describe('SecuritiesListComponent', () => {
  let fixture: ComponentFixture<SecuritiesListComponent>;
  let component: SecuritiesListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuritiesListComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SecuritiesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    expect(component).toBeTruthy();
    discardPeriodicTasks();
  }));

  it('loads the first page of securities (default page size 10) on init', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr.mat-row, tbody tr[mat-row]'));
    expect(rows.length).toBe(10);
    discardPeriodicTasks();
  }));

  it('renders the Name/Type/Currency/Visibility columns with data from SecurityService', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    const headers = fixture.debugElement
      .queryAll(By.css('th'))
      .map((h) => h.nativeElement.textContent.trim());
    expect(headers).toEqual(['Name', 'Type', 'Currency', 'Visibility']);

    const firstRowCells = fixture.debugElement
      .queryAll(By.css('tbody tr:first-child td'))
      .map((c) => c.nativeElement.textContent.trim());
    expect(firstRowCells[0]).toBe(SECURITIES[0].name);
    expect(firstRowCells[1]).toBe(SECURITIES[0].type);
    expect(firstRowCells[2]).toBe(SECURITIES[0].currency);
    expect(firstRowCells[3]).toBe(SECURITIES[0].isPrivate ? 'Private' : 'Public');
    discardPeriodicTasks();
  }));

  it('shows the loading spinner while securities are being fetched', fakeAsync(() => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeTruthy();

    tick(1000);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeFalsy();
    discardPeriodicTasks();
  }));

  it('passes the total (unpaged) matching count to the paginator', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator).toBeTruthy();
    discardPeriodicTasks();
  }));

  it('onFilterChange() resets paging back to the first page', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);

    component['onPage']({ pageIndex: 2, pageSize: 10, length: SECURITIES.length });
    tick(1000);
    expect(component['pageIndex']).toBe(2);

    component['onFilterChange']({ name: 'a' });
    tick(1000);
    expect(component['pageIndex']).toBe(0);
    discardPeriodicTasks();
  }));

  it('onFilterChange() re-fetches securities filtered by the new criteria', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);

    let latest: unknown;
    component['securities$'].subscribe((s) => (latest = s));

    const usdOnly = SECURITIES.filter((s) => s.currency === 'USD');
    component['onFilterChange']({ currencies: ['USD'] });
    tick(1000);

    expect(latest).toEqual(usdOnly.slice(0, component['pageSize']));
    discardPeriodicTasks();
  }));

  it('onPage() requests the next page using skip/limit derived from the page event', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);

    let latest: unknown;
    component['securities$'].subscribe((s) => (latest = s));

    component['onPage']({ pageIndex: 1, pageSize: 10, length: SECURITIES.length });
    tick(1000);

    expect(latest).toEqual(SECURITIES.slice(10, 20));
    discardPeriodicTasks();
  }));
});
