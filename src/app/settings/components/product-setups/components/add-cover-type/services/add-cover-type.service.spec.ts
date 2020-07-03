import { TestBed } from '@angular/core/testing';

import { AddCoverTypeService } from './add-cover-type.service';

describe('AddCoverTypeService', () => {
  let service: AddCoverTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCoverTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
