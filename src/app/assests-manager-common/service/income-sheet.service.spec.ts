import { TestBed } from '@angular/core/testing';

import { IncomeSheetService } from './income-sheet.service';

describe('IncomeSheetService', () => {
  let service: IncomeSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomeSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
