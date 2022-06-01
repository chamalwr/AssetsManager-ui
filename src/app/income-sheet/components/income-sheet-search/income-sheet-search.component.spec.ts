import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeSheetSearchComponent } from './income-sheet-search.component';

describe('IncomeSheetSearchComponent', () => {
  let component: IncomeSheetSearchComponent;
  let fixture: ComponentFixture<IncomeSheetSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeSheetSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeSheetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
