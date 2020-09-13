import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimsService } from '../../services/claims-service.service';
import { Claim } from '../../models/claim.model';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
    selector: 'app-claim-transactions',
    templateUrl: './claim-transactions.component.html',
    styleUrls: ['./claim-transactions.component.scss']
})
export class ClaimTransactionsComponent implements OnInit {
    columnAlignment = 'center';
    claimsListIsLoading = false;

    claimsList: Claim[];
    displayClaimsList: Claim[];
    claimsCount: number = 0;

    searchString: string;

    //spin feedback when loading figures
    claimsLoading: boolean = true;

    constructor(
        private readonly route: Router,
        private readonly claimsService: ClaimsService,
        private readonly claimsProcessingService: ClaimsProcessingServiceService
    ) {}

    viewClaimDetails(claim: Claim): void {
        this.claimsProcessingService.changeClaim(claim);

        this.route.navigateByUrl('/flosure/claims/claim-details/' + claim.id);
    }

    async addClaim(claim: Claim): Promise<void> {}

    ngOnInit(): void {
        this.claimsListIsLoading = true;
        setTimeout(() => {
            this.claimsListIsLoading = false;
        }, 3000);

        this.claimsService.getClaims().subscribe(claims => {
            this.claimsCount = claims.length;
            this.claimsLoading = false;
            this.claimsList = claims;
            console.log(claims);

            this.displayClaimsList = this.claimsList.filter(
                x => x.claimNumber != null
            );
        });
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayClaimsList = this.claimsList.filter(
                x => x.claimNumber != null
            );
        }

        this.displayClaimsList = this.claimsList.filter(claim => {
            if (claim.claimNumber != null) {
                return (
                    claim.claimNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    claim.policy.policyNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    claim.claimStatus
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    claim.claimant.firstName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    claim.lossDate
                        .toLocaleString()
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        });
    }
}
