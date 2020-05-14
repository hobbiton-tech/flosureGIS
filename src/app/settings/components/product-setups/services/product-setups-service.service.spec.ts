import { TestBed } from '@angular/core/testing';

import { ProductSetupsServiceService } from './product-setups-service.service';

describe('ProductSetupsServiceService', () => {
  let service: ProductSetupsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSetupsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
