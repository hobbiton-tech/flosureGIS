import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-claim-approval',
    templateUrl: './claim-approval.component.html',
    styleUrls: ['./claim-approval.component.scss']
})
export class ClaimApprovalComponent implements OnInit {
    columnAlignment = 'center';
    claimApprovalIsLoading = false;

    searchPendingClaimsString: string;
    searchApprovedClaimsString: string;

    constructor() {}

    ngOnInit(): void {
        this.claimApprovalIsLoading = true;
        setTimeout(() => {
            this.claimApprovalIsLoading = false;
        }, 3000);
    }

    searchPendingClaims(value: string) {}

    searchApprovedClaims(value: string) {}
}
