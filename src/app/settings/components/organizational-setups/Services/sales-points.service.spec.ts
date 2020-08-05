import { TestBed } from '@angular/core/testing';

import { SalesPointsService } from './sales-points.service';

describe('SalesPointsService', () => {
  let service: SalesPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
