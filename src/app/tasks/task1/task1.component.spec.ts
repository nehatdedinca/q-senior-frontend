import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Task1Component } from './task1.component';
import { SecuritiesListComponent } from '../../components/securities-list/securities-list.component';

describe('Task1Component', () => {
  let fixture: ComponentFixture<Task1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task1Component, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Task1Component);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the securities-list component', () => {
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.directive(SecuritiesListComponent));
    expect(list).toBeTruthy();
  });
});
