import { TestBed } from '@angular/core/testing';

import { OrgBranchService } from './org-branch.service';

describe('OrgBranchService', () => {
  let service: OrgBranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgBranchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
