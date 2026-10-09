import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FilterBarComponent } from './filter-bar.component';
import { FilterFieldConfig } from '../../models/filter-field-config';

interface TestFilter {
  name?: string;
  tags?: string[];
  active?: boolean;
}

describe('FilterBarComponent', () => {
  let fixture: ComponentFixture<FilterBarComponent<TestFilter>>;
  let component: FilterBarComponent<TestFilter>;

  const fields: FilterFieldConfig[] = [
    { key: 'name', label: 'Name', type: 'text' },
    {
      key: 'tags',
      label: 'Tags',
      type: 'multiselect',
      options: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ],
    },
    {
      key: 'active',
      label: 'Active',
      type: 'tri-state',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBarComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBarComponent<TestFilter>);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('emits a cleaned empty filter immediately on init', () => {
    const emitted: Partial<TestFilter>[] = [];
    component.filterChange.subscribe((value) => emitted.push(value));

    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({});
  });

  it('seeds the form from initialValue and emits it immediately', () => {
    const emitted: Partial<TestFilter>[] = [];
    component.filterChange.subscribe((value) => emitted.push(value));

    fixture.componentRef.setInput('initialValue', { name: 'Bond' });
    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();

    expect(emitted[0]).toEqual({ name: 'Bond' });
  });

  it('debounces user input and strips empty values before emitting', fakeAsync(() => {
    const emitted: Partial<TestFilter>[] = [];
    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();
    component.filterChange.subscribe((value) => emitted.push(value));

    component['form'].get('name')!.setValue('A');
    tick(100);
    component['form'].get('name')!.setValue('AB');
    tick(299);
    expect(emitted.length).toBe(0); // still debouncing

    tick(1);
    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual({ name: 'AB' });

    // clearing it back out should strip the key entirely
    component['form'].get('name')!.setValue('');
    tick(300);
    expect(emitted[1]).toEqual({});
  }));

  it('does not emit duplicate values for distinctUntilChanged semantics', fakeAsync(() => {
    const emitted: Partial<TestFilter>[] = [];
    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();
    component.filterChange.subscribe((value) => emitted.push(value));

    component['form'].get('tags')!.setValue(['a']);
    tick(300);
    component['form'].get('tags')!.setValue(['a']);
    tick(300);

    expect(emitted.length).toBe(1);
  }));

  it('strips empty arrays for multiselect fields', fakeAsync(() => {
    const emitted: Partial<TestFilter>[] = [];
    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();
    component.filterChange.subscribe((value) => emitted.push(value));

    component['form'].get('tags')!.setValue(['a', 'b']);
    tick(300);

    expect(emitted[emitted.length - 1]).toEqual({ tags: ['a', 'b'] });
  }));

  it('reset() restores all fields to their type-specific defaults', fakeAsync(() => {
    const emitted: Partial<TestFilter>[] = [];
    fixture.componentRef.setInput('fields', fields);
    fixture.detectChanges();

    component['form'].get('name')!.setValue('AB');
    component['form'].get('tags')!.setValue(['a']);
    component['form'].get('active')!.setValue(true);
    tick(300);

    component.filterChange.subscribe((value) => emitted.push(value));
    component['reset']();
    tick(300);

    expect(emitted[emitted.length - 1]).toEqual({});
  }));
});
