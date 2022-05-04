import { TestBed } from '@angular/core/testing';

import { ExpenseSheetServiceService } from './expense-sheet-service.service';

describe('ExpenseSheetServiceService', () => {
  let service: ExpenseSheetServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseSheetServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
