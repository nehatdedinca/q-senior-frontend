import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task2Component } from './task2.component';

describe('Task2Component', () => {
  let fixture: ComponentFixture<Task2Component>;
  let component: Task2Component;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Task2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selects/deselects all rows and keeps selectedCount in sync', () => {
    const total = component.rows().length;

    component.selectAll();
    expect(component.selectedCount()).toBe(total);
    expect(component.isSelected(component.rows()[0])).toBeTrue();
    expect(component.isSelected(component.rows()[total - 1])).toBeTrue();

    component.deselectAll();
    expect(component.selectedCount()).toBe(0);
    expect(component.isSelected(component.rows()[0])).toBeFalse();
  });

  it('keeps selection in sync with individual row toggles', () => {
    const row = component.rows()[5];

    component.toggle(row);
    expect(component.isSelected(row)).toBeTrue();
    expect(component.selectedCount()).toBe(1);

    component.toggle(row);
    expect(component.isSelected(row)).toBeFalse();
    expect(component.selectedCount()).toBe(0);
  });

  it('preserves selection across "Recreate data" (new object references, same ids)', () => {
    const row = component.rows()[10];
    component.toggle(row);
    expect(component.isSelected(row)).toBeTrue();

    component.recreateData();

    // New array -> brand-new Row object references with the same ids.
    const recreatedRow = component.rows()[10];
    expect(recreatedRow).not.toBe(row);
    expect(recreatedRow.id).toBe(row.id);
    expect(component.isSelected(recreatedRow)).toBeTrue();
  });

  it('does not rely on a compareWith comparator (O(1) native equality, not O(n) scans)', () => {
    expect(component.selectionModel.compareWith).toBeUndefined();
  });

  it('selects 50 000 rows near-instantly (no O(n^2) comparator scan)', () => {
    const start = performance.now();
    component.selectAll();
    const elapsed = performance.now() - start;

    expect(component.selectedCount()).toBe(component.rows().length);
    // Generous upper bound: an O(n^2) comparator scan over 50k rows would take seconds;
    // the O(n) fix should comfortably finish well under that.
    expect(elapsed).toBeLessThan(500);
  });
});
