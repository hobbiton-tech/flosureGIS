import { Component, OnInit } from '@angular/core';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { AccountService } from '../../services/account.service';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IReceiptModel } from '../models/receipts.model';
import { NzMessageService } from 'ng-zorro-antd';
import { v4 } from 'uuid';

@Component({
    selector: 'app-receipts',
    templateUrl: './receipts.component.html',
    styleUrls: ['./receipts.component.scss'],
})
export class ReceiptsComponent implements OnInit {
    receiptForm: FormGroup;
    receiptsCount = 0;
    unreceiptedList: MotorQuotationModel[];
    receiptedList: IReceiptModel[];
    today = new Date();
    clientName = '';

    receiptList = [];

    isVisible = false;
    isOkLoading = false;
    quoteNumber = '';
    user = '';

    optionList = [
        { label: 'Premium Payment', value: '' },
        { label: 'Third Party Recovery', value: '' },
        { label: 'Imprest Retirement Receipt', value: '' },
        { label: 'Third Party Recovery', value: '' },
        { label: 'General Receipt', value: '' },
    ];
    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

    log(value: { label: string; value: string }): void {
        console.log(value);
    }

    showModal(unreceipted: MotorQuotationModel): void {
        this.isVisible = true;
        this.clientName = unreceipted.clientCode;
        this.quoteNumber = unreceipted.quoteNumber;
        this.user = unreceipted.user;
        console.log(unreceipted);
    }

    async handleOk() {
        this.isOkLoading = true;
        const receipt: IReceiptModel = {
            id: v4(),
            ...this.receiptForm.value,
            onBehalfOf: this.clientName,
            capturedBy: this.user,
            policyNumber: this.quoteNumber,
            todayDate: new Date(),
        };
        await this.receiptService
            .addReceipt(receipt)
            .then((mess) => {
                this.message.success('Receipt Successfully created');
                console.log(mess);
            })
            .catch((err) => {
                this.message.warning('Receipt Failed');
                console.log(err);
            });
        this.receiptForm.reset();
        setTimeout(() => {
            this.isVisible = false;
            this.isOkLoading = false;
        }, 30);
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    constructor(
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService
    ) {
        this.receiptForm = this.formBuilder.group({
            receivedFrom: ['', Validators.required],
            sumInDigits: ['', Validators.required],
            paymentMethod: ['', Validators.required],
            tpinNumber: ['4324324324324324', Validators.required],
            address: ['', Validators.required],
            // sumInWords: ['', Validators.required],
            dateReceived: [''],
            todayDate: [this.today],
            remarks: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.receiptService.getQuotes().subscribe((quotes) => {
            this.unreceiptedList = _.filter(
                quotes,
                (x) => x.status === 'Approved'
            );
            this.receiptsCount = _.filter(
                quotes,
                (x) => x.status === 'Approved'
            ).length;
            console.log('======= Unreceipt List =======');
            console.log(this.unreceiptedList);
        });

        this.receiptService.getReciepts().subscribe((receipts) => {
            this.receiptedList = receipts;
            console.log('======= Receipt List =======');
            console.log(receipts);
        });
    }

    onSubmit() {}
}
