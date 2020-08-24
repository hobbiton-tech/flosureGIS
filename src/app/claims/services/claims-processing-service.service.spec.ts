import { TestBed } from '@angular/core/testing';

import { ClaimsProcessingServiceService } from './claims-processing-service.service';

describe('ClaimsProcessingServiceService', () => {
  let service: ClaimsProcessingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimsProcessingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
