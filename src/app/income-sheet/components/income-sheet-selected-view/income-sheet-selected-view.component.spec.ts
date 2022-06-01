import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeSheetSelectedViewComponent } from './income-sheet-selected-view.component';

describe('IncomeSheetSelectedViewComponent', () => {
  let component: IncomeSheetSelectedViewComponent;
  let fixture: ComponentFixture<IncomeSheetSelectedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeSheetSelectedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeSheetSelectedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
