import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSheetActionsComponent } from './expense-sheet-actions.component';

describe('ExpenseSheetActionsComponent', () => {
  let component: ExpenseSheetActionsComponent;
  let fixture: ComponentFixture<ExpenseSheetActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseSheetActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseSheetActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
