import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeSheetActionsComponent } from './income-sheet-actions.component';

describe('IncomeSheetActionsComponent', () => {
  let component: IncomeSheetActionsComponent;
  let fixture: ComponentFixture<IncomeSheetActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeSheetActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeSheetActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
