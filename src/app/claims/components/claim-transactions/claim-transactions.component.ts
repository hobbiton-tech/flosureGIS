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
    claimsCount: number = 0;

    //spin feedback when loading figures
    claimsLoading: boolean = true;

    constructor(
        private readonly route: Router,
        private readonly claimsService: ClaimsService
    ) {}

    viewClaimDetails(claim: Claim): void {
        this.route.navigateByUrl('/flosure/claims/claim-details/' + claim.claimId);
    }

    async addClaim(claim: Claim): Promise<void> {
        await this.claimsService.addClaim(claim);
    }

    ngOnInit(): void {
        this.claimsService.getClaims().subscribe(claims => {
            this.claimsCount = claims.length;
            this.claimsLoading = false;
            this.claimsList = claims;
            console.log(claims);
        });
    }
}
