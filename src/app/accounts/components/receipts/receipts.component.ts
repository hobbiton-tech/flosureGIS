import { Component, OnInit } from '@angular/core';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { AccountService } from '../../services/account.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-receipts',
    templateUrl: './receipts.component.html',
    styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit {
    receiptsCount = 0;
    unreceipted: MotorQuotationModel[];

    receiptList = [];

    constructor(private receiptService: AccountService) {}

    ngOnInit(): void {
        // this.receiptService.getReciepts().subscribe(receipts => {
        //     console.log('<========receipts=========>');
        //     console.log(receipts);
        //     this.unreceipted = _.filter(receipts, x => x.status === 'Approved');
        //     console.log('<========receipts=========>');
        //     console.log(receipts);

        //     this.receiptsCount = _.filter(
        //         receipts,
        //         x => x.status === 'Approved'
        //     ).length;
        // });

        this.receiptService.getQuotes().subscribe(quotes => {
            this.unreceipted = quotes;
            this.receiptsCount = quotes.length;
            console.log('======= Receipt List =======');
            console.log(this.unreceipted);
        });
    }
}
