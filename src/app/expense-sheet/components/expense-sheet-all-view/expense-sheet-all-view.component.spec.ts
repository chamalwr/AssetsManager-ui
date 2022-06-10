import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSheetAllViewComponent } from './expense-sheet-all-view.component';

describe('ExpenseSheetAllViewComponent', () => {
  let component: ExpenseSheetAllViewComponent;
  let fixture: ComponentFixture<ExpenseSheetAllViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseSheetAllViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseSheetAllViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
