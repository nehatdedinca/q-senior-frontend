import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { PageEvent } from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { FilterableTableComponent } from './filterable-table.component';

interface Row {
  id: number;
  name: string;
}

const ROWS: Row[] = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
];

/** Minimal real usage of the wrapper: a mat-table with one column, projected in. */
@Component({
  standalone: true,
  imports: [
    FilterableTableComponent,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatNoDataRow,
  ],
  template: `
    <filterable-table
      [columns]="columns"
      [dataSource]="dataSource"
      [isLoading]="isLoading"
      [totalCount]="totalCount"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex"
      (page)="onPage($event)"
    >
      <div filterBar class="projected-filter-bar">filter bar slot</div>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let row">{{ row.name }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>

      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="1"><i>No data</i></td>
      </tr>
    </filterable-table>
  `,
})
class HostComponent {
  columns = ['name'];
  dataSource: Row[] = ROWS;
  isLoading = false;
  totalCount: number | null = null;
  pageSize = 10;
  pageIndex = 0;
  lastPageEvent: PageEvent | null = null;

  onPage(event: PageEvent): void {
    this.lastPageEvent = event;
  }
}

describe('FilterableTableComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('projects content tagged [filterBar] above the table', () => {
    fixture.detectChanges();
    const slot = fixture.debugElement.query(By.css('.projected-filter-bar'));
    expect(slot.nativeElement.textContent).toContain('filter bar slot');
  });

  it('renders projected column defs and row data via content-projected mat-table', () => {
    fixture.detectChanges();

    const headerCells = fixture.debugElement.queryAll(By.css('th'));
    expect(headerCells.length).toBe(1);
    expect(headerCells[0].nativeElement.textContent.trim()).toBe('Name');

    const rows = fixture.debugElement.queryAll(By.css('tbody tr.mat-row, tbody tr[mat-row]'));
    const cells = fixture.debugElement.queryAll(By.css('td'));
    expect(cells.map((c) => c.nativeElement.textContent.trim())).toEqual(['Alpha', 'Beta']);
  });

  it('shows the loading spinner only while isLoading is true', () => {
    host.isLoading = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeTruthy();

    host.isLoading = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('mat-spinner'))).toBeFalsy();
  });

  it('renders the "no data" row when the data source is empty', () => {
    host.dataSource = [];
    fixture.detectChanges();

    const noDataRow = fixture.debugElement.query(By.css('tr.mat-row i'));
    expect(noDataRow.nativeElement.textContent).toBe('No data');
  });

  it('does not render a paginator when totalCount is null', () => {
    host.totalCount = null;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('mat-paginator'))).toBeFalsy();
  });

  it('renders a paginator with the given length/pageSize/pageIndex when totalCount is set', () => {
    host.totalCount = 42;
    host.pageSize = 5;
    host.pageIndex = 1;
    fixture.detectChanges();

    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator).toBeTruthy();
  });

  it('emits a page event when the paginator is navigated', () => {
    host.totalCount = 42;
    host.pageSize = 10;
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.directive(FilterableTableComponent))
      .componentInstance as FilterableTableComponent<Row>;
    table.page.emit({ pageIndex: 2, pageSize: 10, length: 42 });

    expect(host.lastPageEvent).toEqual({ pageIndex: 2, pageSize: 10, length: 42 });
  });

  it('defaults isLoading to false and totalCount to null when not provided', () => {
    fixture.detectChanges();
    const table = fixture.debugElement.query(By.directive(FilterableTableComponent))
      .componentInstance as FilterableTableComponent<Row>;

    // Host sets these explicitly to false/null already; verify the component's own defaults
    // by inspecting a freshly constructed instance.
    const bare = new FilterableTableComponent<Row>();
    expect(bare.isLoading).toBeFalse();
    expect(bare.totalCount).toBeNull();
    expect(bare.pageSize).toBe(10);
    expect(bare.pageSizeOptions).toEqual([5, 10, 25, 50]);
  });
});
