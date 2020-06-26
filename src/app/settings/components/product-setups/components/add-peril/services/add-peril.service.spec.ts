import { TestBed } from '@angular/core/testing';

import { AddPerilService } from './add-peril.service';

describe('AddPerilService', () => {
  let service: AddPerilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPerilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
