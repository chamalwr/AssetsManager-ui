import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeSheetAllViewComponent } from './income-sheet-all-view.component';

describe('IncomeSheetAllViewComponent', () => {
  let component: IncomeSheetAllViewComponent;
  let fixture: ComponentFixture<IncomeSheetAllViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeSheetAllViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeSheetAllViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
