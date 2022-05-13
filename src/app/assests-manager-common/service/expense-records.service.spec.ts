import { TestBed } from '@angular/core/testing';

import { ExpenseRecordsService } from './expense-records.service';

describe('ExpenseRecordsService', () => {
  let service: ExpenseRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
