import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { IReceiptModel } from '../models/receipts.model';
import { IReceiptDTO } from 'src/app/quotes/models/receipt.dto';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-view-receipts',
    templateUrl: './view-receipts.component.html',
    styleUrls: ['./view-receipts.component.scss'],
})
export class ViewReceiptsComponent implements OnInit {
    receiptsList: Policy[];
    receiptsCount = 0;
    showReceiptModal = false;
    receiptedList: IReceiptModel[];
    receiptObj: IReceiptModel = new IReceiptModel();
    receipt: IReceiptModel;
    today = new Date();
    receiptURl: string;
    _id: string;
    loadingReceipt = false;
    constructor(
        private receiptService: AccountService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((param) => {
            console.log('++++++++++PARAM+++++++++');
            console.log(param);
            this._id = param.id;

            this.loadingReceipt = true;

            setTimeout(() => {
                this.loadingReceipt = false;
            }, 3000);

            this.generateDocuments();
        });
    }

    generateDocuments(): void {
        this.receiptService.getReciepts().subscribe((receipts) => {
            this.receiptObj = receipts.filter((x) => x.id === this._id)[0];
            this.receiptedList = receipts;
            this.receipt = this.receiptedList.filter(
                (x) => x.id === this._id
            )[0];

            const receipt: IReceiptDTO = {
                recieptNumber: this.receipt.receiptNumber,
                tPin: this.receipt.tpinNumber,
                recievedFrom: this.receipt.receivedFrom,
                onBehalfOf: this.receipt.onBehalfOf,
                address: 'this.receipt.address',
                sumInWords: 'sum in words',
                agentID: this.receipt.capturedBy,
                paymentMethod: this.receipt.paymentMethod,
                paymentRef: this.receipt.receiptNumber,
                policyNumber: this.receipt.policyNumber,
                remarks: this.receipt.receiptType,
                todayDate: this.receipt.todayDate,
                time: this.receipt.receiptNumber,
                narration: this.receipt.narration,
                accountNumber: 'this.receipt.address',
                dateRecieved: this.receipt.todayDate,
                sumInDigits: this.receipt.sumInDigits,
                capturedBy: this.receipt.receiptNumber,
            };

            this.receiptService.generateReceipt(receipt).subscribe((data) => {
                this.receiptURl = data.Location;
                console.log('++++++++RECEIPT DATA++++++++');
                console.log(data);
            });

            console.log(this.receipt);
        });
        // console.log(this.isReceiptApproved);
    }
    // printPage() {}
}
