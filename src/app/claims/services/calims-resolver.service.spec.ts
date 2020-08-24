import { TestBed } from '@angular/core/testing';

import { CalimsResolverService } from './calims-resolver.service';

describe('CalimsResolverService', () => {
  let service: CalimsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalimsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
