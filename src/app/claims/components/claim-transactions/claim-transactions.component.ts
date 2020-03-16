import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { generateClaimsList } from '../../models/claim.model';
import { Router } from '@angular/router';
import { ClaimsService } from '../../services/claims-service.service';
import { Claim } from '../../models/claim.model'

@Component({
    selector: 'app-claim-transactions',
    templateUrl: './claim-transactions.component.html',
    styleUrls: ['./claim-transactions.component.scss']
})
export class ClaimTransactionsComponent implements OnInit {
    claimsList = generateClaimsList();

    constructor(
        private readonly route: Router,
        private cdr: ChangeDetectorRef,
        private readonly claimsService: ClaimsService

    ) {}

    viewClaimDetails(): void {
        this.route.navigateByUrl('/claims/claim-details');
    }

    addClaim(claim: Claim): void {
        this.claimsService.addClaim(claim);
      }

    ngOnInit(): void {}
}
