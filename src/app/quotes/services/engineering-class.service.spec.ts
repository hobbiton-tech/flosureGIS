import { TestBed } from '@angular/core/testing';

import { EngineeringClassService } from './engineering-class.service';

describe('EngineeringClassService', () => {
  let service: EngineeringClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EngineeringClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
