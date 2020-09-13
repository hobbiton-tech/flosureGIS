import { TestBed } from '@angular/core/testing';

import { InsuranceClassHandlerService } from './insurance-class-handler.service';

describe('InsuranceClassHandlerService', () => {
  let service: InsuranceClassHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceClassHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
