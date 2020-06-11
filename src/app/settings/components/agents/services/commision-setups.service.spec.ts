import { TestBed } from '@angular/core/testing';

import { CommisionSetupsService } from './commision-setups.service';

describe('CommisionSetupsService', () => {
  let service: CommisionSetupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommisionSetupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
