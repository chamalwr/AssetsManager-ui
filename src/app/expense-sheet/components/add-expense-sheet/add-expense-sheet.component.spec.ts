import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseSheetComponent } from './add-expense-sheet.component';

describe('AddExpenseSheetComponent', () => {
  let component: AddExpenseSheetComponent;
  let fixture: ComponentFixture<AddExpenseSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpenseSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpenseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
