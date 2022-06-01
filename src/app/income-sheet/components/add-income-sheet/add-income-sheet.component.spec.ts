import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncomeSheetComponent } from './add-income-sheet.component';

describe('AddIncomeSheetComponent', () => {
  let component: AddIncomeSheetComponent;
  let fixture: ComponentFixture<AddIncomeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncomeSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncomeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
