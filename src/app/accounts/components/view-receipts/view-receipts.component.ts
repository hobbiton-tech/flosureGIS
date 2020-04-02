import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Policy } from 'src/app/underwriting/models/policy.model';

@Component({
    selector: 'app-view-receipts',
    templateUrl: './view-receipts.component.html',
    styleUrls: ['./view-receipts.component.scss'],
})
export class ViewReceiptsComponent implements OnInit {
    receiptsList: Policy[];
    receiptsCount = 0;
    showReceiptModal = false;
    constructor(private accountService: AccountService) {}

    ngOnInit(): void {
        // this.accountService.getReciepts().subscribe(data => {
        //     this.receiptsList = data;
        //     this.receiptsCount = data.length;
        // });
    }
}
