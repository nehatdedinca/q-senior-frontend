import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { SecuritiesFilter, PagingFilter } from '../../models/securities-filter';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { FilterFieldConfig } from '../../models/filter-field-config';
import { buildSecuritiesFilterFields } from '../../models/securities-filter-fields';
import { AsyncPipe } from '@angular/common';

const DEFAULT_PAGE_SIZE = 10;

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    FilterBarComponent,
    AsyncPipe,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  protected displayedColumns: string[] = [
    'name',
    'type',
    'currency',
    'isPrivate',
  ];

  protected readonly pageSize = DEFAULT_PAGE_SIZE;
  protected pageIndex = 0;

  private _securityService = inject(SecurityService);

  protected loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Field config for the filter bar; options are fetched so new types/currencies in the
   *  backend show up automatically without touching this component. */
  protected filterFields$: Observable<FilterFieldConfig[]> = combineLatest([
    this._securityService.getSecurityTypes(),
    this._securityService.getSecurityCurrencies(),
  ]).pipe(
    map(([types, currencies]) => buildSecuritiesFilterFields(types, currencies))
  );

  private _filter$ = new BehaviorSubject<SecuritiesFilter>({});
  private _paging$ = new BehaviorSubject<PagingFilter>({
    skip: 0,
    limit: this.pageSize,
  });

  protected totalCount$: Observable<number> = this._filter$.pipe(
    switchMap((filter) => this._securityService.getSecuritiesCount(filter))
  );

  protected securities$: Observable<Security[]> = combineLatest([
    this._filter$,
    this._paging$,
  ]).pipe(
    switchMap(([filter, paging]) =>
      this._securityService
        .getSecurities({ ...filter, ...paging })
        .pipe(indicate(this.loadingSecurities$))
    )
  );

  /** Filter bar only ever emits a brand-new filter -> reset back to the first page. */
  protected onFilterChange(filter: Partial<SecuritiesFilter>): void {
    this._filter$.next(filter);
    this.pageIndex = 0;
    this._paging$.next({ skip: 0, limit: this.pageSize });
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this._paging$.next({
      skip: event.pageIndex * event.pageSize,
      limit: event.pageSize,
    });
  }
}

