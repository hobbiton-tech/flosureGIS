import { Component, OnInit } from '@angular/core';
import { generateClaimsList } from '../../models/claim.model';

@Component({
    selector: 'app-claim-transactions',
    templateUrl: './claim-transactions.component.html',
    styleUrls: ['./claim-transactions.component.scss']
})
export class ClaimTransactionsComponent implements OnInit {
    claimsList = generateClaimsList();
    constructor() {}

    ngOnInit(): void {}
}
