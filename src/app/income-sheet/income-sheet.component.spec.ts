import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeSheetComponent } from './income-sheet.component';

describe('IncomeSheetComponent', () => {
  let component: IncomeSheetComponent;
  let fixture: ComponentFixture<IncomeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
