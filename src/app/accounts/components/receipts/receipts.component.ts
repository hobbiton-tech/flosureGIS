import { Component, OnInit } from '@angular/core';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { AccountService } from '../../services/account.service';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IReceiptModel } from '../models/receipts.model';
import { NzMessageService } from 'ng-zorro-antd';
import { v4 } from 'uuid';
import { IReceiptDTO } from 'src/app/quotes/models/receipt.dto';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    receiptObj: IReceiptModel = new IReceiptModel();
    receipt: IReceiptModel;
    today = new Date();
    clientName = '';
    quote: MotorQuotationModel = new MotorQuotationModel();
    size = 'large';

    receiptNum = '';

    receiptList = [];

    isVisible = false;
    isOkLoading = false;
    quoteNumber = '';
    user = '';
    _id = '';

    // modal
    isReceiptVisible = false;
    isConfirmLoading = false;
    showDocumentModal = false;
    isReceiptApproved = false;

    // generated PDFs
    receiptURl = '';
    showReceiptModal = false;

    optionList = [
        { label: 'Premium Payment', value: 'Premium Payment' },
        { label: 'Third Party Recovery', value: 'Third Party Recovery' },
        {
            label: 'Imprest Retirement Receipt',
            value: 'Imprest Retirement Receipt',
        },
        { label: 'Third Party Recovery', value: 'Third Party Recovery' },
        { label: 'General Receipt', value: 'General Receipt' },
    ];

    paymentMethodList = [
        { label: 'Cash', value: 'cash' },
        { label: 'EFT', value: 'eft' },
        { label: 'Bank Transfer', value: 'bank transfer' },
    ];

    showModal(unreceipted: MotorQuotationModel): void {
        this.isVisible = true;
        this.clientName = unreceipted.clientCode;
        this.quoteNumber = unreceipted.quoteNumber;
        this.user = unreceipted.user;
        this.quote = unreceipted;
        console.log(unreceipted);
    }

    async handleOk() {
        this.isOkLoading = true;
        this._id = v4();
        const receipt: IReceiptModel = {
            id: this._id,
            ...this.receiptForm.value,
            onBehalfOf: this.clientName,
            capturedBy: this.user,
            policyNumber: this.quoteNumber,
            todayDate: new Date(),
        };

        this.receiptNum = this._id;
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

        this.quote.receiptStatus = 'Receipted';
        console.log('<++++++++++++++++++CLAIN+++++++++>');
        console.log(this.quote);

        await this.receiptService.updateQuote(this.quote);

        this.generateDocuments();
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    constructor(
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private http: HttpClient
    ) {
        this.receiptForm = this.formBuilder.group({
            receivedFrom: ['', Validators.required],
            sumInDigits: ['', Validators.required],
            paymentMethod: ['', Validators.required],
            tpinNumber: ['4324324324324324', Validators.required],
            address: ['', Validators.required],
            receiptType: ['', Validators.required],
            sumInWords: [''],
            dateReceived: [''],
            todayDate: [this.today],
            remarks: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.receiptService.getQuotes().subscribe((quotes) => {
            this.unreceiptedList = _.filter(
                quotes,
                (x) =>
                    x.status === 'Approved' && x.receiptStatus === 'Unreceipted'
            );
            this.receiptsCount = _.filter(
                quotes,
                (x) =>
                    x.status === 'Approved' && x.receiptStatus === 'Unreceipted'
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

    generateID(id) {
        console.log('++++++++++++ID++++++++++++');
        this._id = id;
        console.log(this._id);
        this.generateDocuments();
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
                accountNumber: 'this.receipt.address',
                dateRecieved: this.receipt.todayDate,
                sumInDigits: this.receipt.sumInDigits,
                capturedBy: this.receipt.receiptNumber,
            };

            this.receiptService.generateReceipt(receipt).subscribe((data) => {
                this.receiptURl = data.Location;
            });

            console.log(this.receipt);
        });

        //   const receipt: IReceiptDTO = {
        //       recieptNumber: this.receiptForm.controls.recieptNumber.value,
        //       tPin: this.receiptForm.controls.tpinNumber.value,
        //       recievedFrom: this.receiptForm.controls.recievedFrom.value,
        //       onBehalfOf: this.clientName,
        //       address: this.receiptForm.controls.address.value,
        //       sumInWords: this.receiptForm.controls.recieptNumber.value,
        //       dateRecieved: this.receiptForm.controls.dateReceived.value,
        //       agentID: '',
        //       paymentMethod: this.receiptForm.controls.paymentMethod.value,
        //       paymentRef: '',
        //       policyNumber: this.quoteNumber,
        //       remarks: '',
        //       todayDate: this.receiptForm.controls.todayDate.value,
        //       time: '',
        //       accountNumber: '',
        //       sumInDigits: this.receiptForm.controls.sumInDigits.value,
        //       capturedBy: this.user,
        // };

        // const receipt$ = this.receiptService.generateReceipt(receipt);

        // combineLatest([receipt$]).subscribe(([receipt]) => {
        //     this.receiptURl = receipt.Location;
        // });

        this.isReceiptApproved = true;

        console.log('reerewrew');
        console.log(this.isReceiptApproved);

        // this.http.get(
        //     'https://flosurepdfs.s3.us-east-2.amazonaws.com/%27String%27-cd4f17da-423c-48a3-be90-79883ab6682c.pdf%22'
        // );
    }
}
