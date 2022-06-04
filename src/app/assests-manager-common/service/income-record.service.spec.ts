import { TestBed } from '@angular/core/testing';

import { IncomeRecordService } from './income-record.service';

describe('IncomeRecordService', () => {
  let service: IncomeRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomeRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
