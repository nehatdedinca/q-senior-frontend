import { TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { SecurityService } from './security.service';
import { SECURITIES } from '../mocks/securities-mocks';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityService);
  });

  it('paginates using skip/limit as (start, count) rather than (start, end)', fakeAsync(() => {
    let result: unknown;
    service.getSecurities({ skip: 2, limit: 3 }).subscribe((r) => (result = r));
    tick(1000);

    expect(result).toEqual(SECURITIES.slice(2, 5));
  }));

  it('getSecuritiesCount returns the total matching count, ignoring paging', fakeAsync(() => {
    let count: number | undefined;
    service
      .getSecuritiesCount({ skip: 0, limit: 1 })
      .subscribe((c) => (count = c));
    tick(300);

    expect(count).toBe(SECURITIES.length);
  }));

  it('getSecuritiesCount respects non-paging filter criteria', fakeAsync(() => {
    const expected = SECURITIES.filter((s) => s.currency === 'USD').length;
    let count: number | undefined;
    service.getSecuritiesCount({ currencies: ['USD'] }).subscribe((c) => (count = c));
    tick(300);

    expect(count).toBe(expected);
  }));

  it('getSecurityTypes returns sorted distinct types', fakeAsync(() => {
    let types: string[] | undefined;
    service.getSecurityTypes().subscribe((t) => (types = t));
    tick(300);

    const expected = Array.from(new Set(SECURITIES.map((s) => s.type))).sort();
    expect(types).toEqual(expected);
  }));

  it('getSecurityCurrencies returns sorted distinct currencies', fakeAsync(() => {
    let currencies: string[] | undefined;
    service.getSecurityCurrencies().subscribe((c) => (currencies = c));
    tick(300);

    const expected = Array.from(new Set(SECURITIES.map((s) => s.currency))).sort();
    expect(currencies).toEqual(expected);
  }));
});
