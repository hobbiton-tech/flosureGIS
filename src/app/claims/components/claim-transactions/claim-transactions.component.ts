import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimsService } from '../../services/claims-service.service';
import { Claim } from '../../models/claim.model';

@Component({
    selector: 'app-claim-transactions',
    templateUrl: './claim-transactions.component.html',
    styleUrls: ['./claim-transactions.component.scss']
})
export class ClaimTransactionsComponent implements OnInit {
    claimsList: Claim[];

    constructor(
        private readonly route: Router,
        private readonly claimsService: ClaimsService
    ) {}

    viewClaimDetails(): void {
        this.route.navigateByUrl('/flosure/claims/claim-details');
    }

    async addClaim(claim: Claim): Promise<void> {
        await this.claimsService.addClaim(claim);
    }

    ngOnInit(): void {
        this.claimsService.getClaims().subscribe(claims => {
            this.claimsList = claims;
            console.log(claims);
        });
    }
}
