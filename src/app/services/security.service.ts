import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Security } from '../models/security';
import { SECURITIES } from '../mocks/securities-mocks';
import { SecuritiesFilter } from '../models/securities-filter';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  /**
   * Get Securities server request mock
   * */
  getSecurities(securityFilter?: SecuritiesFilter): Observable<Security[]> {
    const skip = securityFilter?.skip ?? 0;
    const limit = securityFilter?.limit ?? 100;
    const filteredSecurities = this._filterSecurities(securityFilter).slice(
      skip,
      skip + limit
    );

    return of(filteredSecurities).pipe(delay(1000));
  }

  /**
   * Returns the total number of securities matching the given filter (ignoring paging),
   * needed by the UI to render pagination controls for server-side paging.
   * */
  getSecuritiesCount(securityFilter?: SecuritiesFilter): Observable<number> {
    return of(this._filterSecurities(securityFilter).length).pipe(delay(300));
  }

  /** Distinct security types available, used to populate filter options. */
  getSecurityTypes(): Observable<string[]> {
    return of(this._distinct((s) => s.type)).pipe(delay(300));
  }

  /** Distinct security currencies available, used to populate filter options. */
  getSecurityCurrencies(): Observable<string[]> {
    return of(this._distinct((s) => s.currency)).pipe(delay(300));
  }

  private _distinct(selector: (security: Security) => string): string[] {
    return Array.from(new Set(SECURITIES.map(selector))).sort();
  }

  private _filterSecurities(
    securityFilter: SecuritiesFilter | undefined
  ): Security[] {
    if (!securityFilter) return SECURITIES;

    return SECURITIES.filter(
      (s) =>
        (!securityFilter.name || s.name.includes(securityFilter.name)) &&
        (!securityFilter.types ||
          securityFilter.types.some((type) => s.type === type)) &&
        (!securityFilter.currencies ||
          securityFilter.currencies.some(
            (currency) => s.currency == currency
          )) &&
        (securityFilter.isPrivate === undefined ||
          securityFilter.isPrivate === s.isPrivate)
    );
  }
}
