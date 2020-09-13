import { TestBed } from '@angular/core/testing';

import { AccidentClassService } from './accident-class.service';

describe('AccidentClassService', () => {
  let service: AccidentClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccidentClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
