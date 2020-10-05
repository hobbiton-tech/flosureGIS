import { TestBed } from '@angular/core/testing';

import { MarineClassService } from './marine-class.service';

describe('MarineClassService', () => {
  let service: MarineClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarineClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
