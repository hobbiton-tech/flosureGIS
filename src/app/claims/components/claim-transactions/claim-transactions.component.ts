import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { generateClaimsList } from '../../models/claim.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-claim-transactions',
    templateUrl: './claim-transactions.component.html',
    styleUrls: ['./claim-transactions.component.scss']
})
export class ClaimTransactionsComponent implements OnInit {
    claimsList = generateClaimsList();

    constructor(
        private readonly route: Router,
        private cdr: ChangeDetectorRef
    ) {}

    viewClaimDetails(): void {
        this.route.navigateByUrl('/claims/claim-details');
    }

    ngOnInit(): void {}
}
