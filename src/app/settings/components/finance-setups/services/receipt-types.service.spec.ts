import { TestBed } from '@angular/core/testing';

import { ReceiptTypesService } from './receipt-types.service';

describe('ReceiptTypesService', () => {
  let service: ReceiptTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
