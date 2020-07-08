import { TestBed } from '@angular/core/testing';

import { DiscountTypesService } from './discount-types.service';

describe('DiscountTypesService', () => {
  let service: DiscountTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
