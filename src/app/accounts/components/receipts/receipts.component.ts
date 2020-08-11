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
import { Router } from '@angular/router';
import { Policy } from 'src/app/underwriting/models/policy.model';
import {
    IAgent,
    IBroker,
} from 'src/app/settings/components/agents/models/agents.model';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';

import { IPaymentMethod } from 'src/app/settings/models/finance/payment-methodes.model';
import { PaymentMethodService } from 'src/app/settings/components/finance-setups/services/payment-method.service'
import { ReceiptTypesService } from 'src/app/settings/components/finance-setups/services/receipt-types.service';
import { IReceiptTypes } from 'src/app/settings/models/finance/receipt-types.model';

@Component({
    selector: 'app-receipts',
    templateUrl: './receipts.component.html',
    styleUrls: ['./receipts.component.scss'],

})
export class ReceiptsComponent implements OnInit {

    receiptForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    submitted = false;
    receiptsCount = 0;
    unreceiptedList: Policy[];
    receiptedList: IReceiptModel[];
    brokerList: IBroker[];
    cancelledReceiptList: IReceiptModel[];
    receiptObj: IReceiptModel = new IReceiptModel();
    receipt: IReceiptModel;
    today = new Date();
    clientName = '';
    policy: Policy = new Policy();
    cancelReceipt: IReceiptModel = new IReceiptModel();
    reinstateReceipt: IReceiptModel = new IReceiptModel();
    size = 'large';

    cheque = false;


    paymentMethodList: IPaymentMethod[] = [];


    receiptTypeList: IReceiptTypes[] = [];
    //   receiptTypeId: string | null = null;

    recStatus = 'Receipted';

    receiptNum = '';

    policyAmount = 0;

    receiptList = [];
    cancelReceiptList = [];

    isVisibleBrokerReceipting = false;
    isCancelVisible = false;
    isReinstateVisible = false;
    isOkBrokerReceiptingLoading = false;
    policyNumber = '';
    user = '';
    _id = '';
    isVisibleClientType = false;
    isOkClientTypeLoading = false;

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

    paymentMethod: any;
    Method_name: any;
    // cheque : any;
    // paymentMethodList = [
    //     { label: 'Cash', value: 'cash' },
    //     { label: 'EFT', value: 'eft' },
    //     { label: 'Bank Transfer', value: 'bank transfer' },
    // ];

    typeOfClient = ['Direct', 'Agent', 'Broker', 'Sales Representatives', 'Plan Receipt'];

    selectedType = 'Direct';
    selectedAgent = '';
    receiptNewCount: number;

    // cheque: (value: any) => void;

    constructor(
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router,
        private agentService: AgentsService,
        private PaymentMethodService: PaymentMethodService,
        private ReceiptTypeService: ReceiptTypesService,
    ) {
        this.receiptForm = this.formBuilder.group({
            receivedFrom: ['', Validators.required],
            sumInDigits: ['', Validators.required],
            paymentMethod: ['', Validators.required],
            onBehalfOf: ['', Validators.required],
            tpinNumber: ['4324324324324324'],
            address: [''],
            receiptType: ['', Validators.required],
            narration: ['', Validators.required],
            sumInWords: [''],
            dateReceived: [''],
            todayDate: [this.today],
            cheqNumber: [''],
            remarks: [''],
        });

        this.cancelForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
        this.reinstateForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
    }



    ngOnInit(): void {
        this.agentService.getBrokers().subscribe((brokers) => {
            this.brokerList = brokers;

            console.log('===================');
            console.log(this.brokerList);
        });
        this.receiptService.getPolicies().subscribe((quotes) => {
            this.unreceiptedList = _.filter(
                quotes,
                (x) => x.receiptStatus === 'Unreceipted'
            );
            this.receiptsCount = _.filter(
                quotes,
                (x) => x.receiptStatus === 'Unreceipted'
            ).length;
            console.log('======= Unreceipt List =======');
            console.log(this.unreceiptedList);
        });

        this.receiptService.getReciepts().subscribe((receipts) => {
            this.receiptedList = _.filter(
                receipts,
                (x) => x.receipt_status === 'Receipted'
            );

            console.log('======= Receipt List =======');
            console.log(this.receiptedList);

            this.cancelReceiptList = _.filter(
                receipts,
                (x) => x.receipt_status === 'Cancelled'
            );

            console.log('======= Cancelled Receipt List =======');
            console.log(this.cancelReceiptList);
            this.receiptNewCount = receipts.length;
        });
        ///////////////////////////////////
        ///////// PAYMENT ////////////////////
        /////////////////////////////////////////
        this.PaymentMethodService.getPaymentMethods().subscribe((res) => {
            this.paymentMethodList = res;
        });
        //////////////////////////////////
        /////////// RECEIPT ///////////////
        ////////////////////////////////
        this.ReceiptTypeService.getReceiptTypes().subscribe((res) => {
            this.receiptTypeList = res;
        });
    }

    showBrokerReceiptModal(): void {
        this.isVisibleBrokerReceipting = true;
    }

    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    async handleOkBrokerReceipting() {
        this.submitted = true;
        if (this.receiptForm.valid) {
            this.isOkBrokerReceiptingLoading = true;
            this._id = v4();
            const receipt: IReceiptModel = {
                ...this.receiptForm.value,
                on_behalf_of: this.clientName,
                captured_by: 'this.user',
                receipt_status: this.recStatus,
                today_date: new Date(),
                source_of_business: 'broker',
                intermediary_name: this.receiptForm.controls.onBehalfOf.value,
            };

            this.receiptNum = this._id;
            await this.receiptService
                .addReceipt(receipt, this.policy.risks[0].insuranceType ).subscribe((mess) => {
                    this.message.success('Receipt Successfully created');
                    console.log(mess);
                },
                (err) => {
                    this.message.warning('Receipt Failed');
                    console.log(err);
                });
                // .then((mess) => {
                //     this.message.success('Receipt Successfully created');
                //     console.log(mess);
                // })
                // .catch((err) => {
                //     this.message.warning('Receipt Failed');
                //     console.log(err);
                // });
            this.receiptForm.reset();
            this.policy.receiptStatus = 'Receipted';
            this.policy.paymentPlan = 'Created';
            console.log('<++++++++++++++++++CLAIN+++++++++>');
            console.log(this.policy);

            await this.receiptService.updatePolicy(this.policy);
            setTimeout(() => {
                this.isVisibleBrokerReceipting = false;
                this.isOkBrokerReceiptingLoading = false;
            }, 3000);
            this.generateID(this._id);
        }
    }

    handleCancelBrokerReceipting(): void {
        this.isVisibleBrokerReceipting = false;
    }
    // showCancelModal(receipt: IReceiptModel) {
    //     this.isCancelVisible = true;
    //     this.cancelReceipt = receipt;
    // }

    // cancelCancellation() {
    //     this.isCancelVisible = false;
    // }

    // async onCancel() {
    //     this.cancelReceipt.receiptStatus = 'Cancelled';
    //     this.cancelReceipt.remarks = this.cancelForm.controls.remarks.value;
    //     console.log('<++++++++++++++++++CLAIN+++++++++>');
    //     console.log(this.cancelReceipt);
    //     await this.receiptService.updateReceipt(this.cancelReceipt);
    //     this.isCancelVisible = false;
    // }

    // showReinstateModal(receipt: IReceiptModel) {
    //     this.isReinstateVisible = true;
    //     this.reinstateReceipt = receipt;
    // }

    // cancelReinstate() {
    //     this.isReinstateVisible = false;
    // }

    // async onReinstate() {
    //     this.reinstateReceipt.receiptStatus = 'Receipted';
    //     this.reinstateReceipt.remarks = this.cancelForm.controls.remarks.value;
    //     console.log('<++++++++++++++++++CLAIN+++++++++>');
    //     console.log(this.reinstateReceipt);
    //     await this.receiptService.updateReceipt(this.reinstateReceipt);
    //     this.isReinstateVisible = false;
    // }




    // paymentMethodChange(value) {
    //     console.log('ON CHANGE>>>>', value);
    //     this.paymentMethod = value;
    // }




    payChange(value) {
        console.log('value....', value);
        if (value === ' cheque') {
            this.cheque = true;
        } else {
            this.cheque = false;
        }
    }


    // paymentMethodChange(value) {
    //     console.log('ON CHANGE>>>>', value);
    //     this.paymentMethod = value;

    //     if (value === 'cheque')
    //         this.cheque = true;
    // }

    // pop Confirm
    cancel() { }

    generateID(id) {
        console.log('++++++++++++ID++++++++++++');
        this._id = id;
        console.log(this._id);
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + this._id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }

    showClientTypeModal(): void {
        this.isVisibleClientType = true;
    }

    handleOkClientType(): void {
        this.isVisibleClientType = false;
    }

    handleCancelClientType(): void {
        this.isVisibleClientType = false;
    }
}
