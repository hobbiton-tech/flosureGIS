import { TestBed } from '@angular/core/testing';

import { InsuranceClassService } from './insurance-class.service';

describe('InsuranceClassService', () => {
  let service: InsuranceClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
