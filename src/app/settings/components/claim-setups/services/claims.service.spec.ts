import { TestBed } from '@angular/core/testing';

import { ClaimSetupsService } from './claim-setups.service';

describe('ClaimsService', () => {
    let service: ClaimSetupsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClaimSetupsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
