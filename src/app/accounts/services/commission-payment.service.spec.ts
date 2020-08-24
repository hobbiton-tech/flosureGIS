import { TestBed } from '@angular/core/testing';

import { CommissionPaymentService } from './commission-payment.service';

describe('CommissionPaymentService', () => {
  let service: CommissionPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommissionPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
