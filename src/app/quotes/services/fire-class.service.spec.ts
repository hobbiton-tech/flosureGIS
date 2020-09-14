import { TestBed } from '@angular/core/testing';

import { FireClassService } from './fire-class.service';

describe('FireClassService', () => {
  let service: FireClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
