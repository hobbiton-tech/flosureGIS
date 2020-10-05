import { TestBed } from '@angular/core/testing';

import { TransactionInvoiceService } from './transaction-invoice.service';

describe('TransactionInvoiceService', () => {
  let service: TransactionInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
