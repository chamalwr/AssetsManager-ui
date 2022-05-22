import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSheetSelectedViewComponent } from './expense-sheet-selected-view.component';

describe('ExpenseSheetSelectedViewComponent', () => {
  let component: ExpenseSheetSelectedViewComponent;
  let fixture: ComponentFixture<ExpenseSheetSelectedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseSheetSelectedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseSheetSelectedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
