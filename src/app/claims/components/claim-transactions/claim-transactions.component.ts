import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimsService } from '../../services/claims-service.service';
import { Claim } from '../../models/claim.model';

@Component({
    selector: 'app-claim-transactions',
    templateUrl: './claim-transactions.component.html',
    styleUrls: ['./claim-transactions.component.scss'],
})
export class ClaimTransactionsComponent implements OnInit {
    claimsList: Claim[];
    displayClaimsList: Claim[];
    claimsCount: number = 0;

    searchString: string;

    //spin feedback when loading figures
    claimsLoading: boolean = true;

    constructor(
        private readonly route: Router,
        private readonly claimsService: ClaimsService
    ) {}

    viewClaimDetails(claim: Claim): void {
        this.route.navigateByUrl(
            '/flosure/claims/claim-details/' + claim.claimId
        );
    }

    async addClaim(claim: Claim): Promise<void> {
        await this.claimsService.addClaim(claim);
    }

    ngOnInit(): void {
        this.claimsService.getClaims().subscribe((claims) => {
            this.claimsCount = claims.length;
            this.claimsLoading = false;
            this.claimsList = claims;
            console.log(claims);

            this.displayClaimsList = this.claimsList;
        });
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayClaimsList = this.claimsList;
        }

        this.displayClaimsList = this.claimsList.filter(claim => {   
                return (claim.claimId.toLowerCase().includes(value.toLowerCase())
            || claim.policyNumber.toLocaleLowerCase().includes(value.toLowerCase()) 
            || claim.clientName.toLocaleLowerCase().includes(value.toLowerCase())
            || claim.status.toLocaleLowerCase().includes(value.toLowerCase()));
        });
    }
}
