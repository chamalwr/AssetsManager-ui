import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSheetSearchComponent } from './expense-sheet-search.component';

describe('ExpenseSheetSearchComponent', () => {
  let component: ExpenseSheetSearchComponent;
  let fixture: ComponentFixture<ExpenseSheetSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseSheetSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseSheetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
