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

    paymentMethodList = [
        { label: 'Cash', value: 'cash' },
        { label: 'EFT', value: 'eft' },
        { label: 'Bank Transfer', value: 'bank transfer' },
    ];

    typeOfClient = ['Direct', 'Agent', 'Broker', 'Sales Representatives'];

    selectedType = 'Direct';
    selectedAgent = '';
    receiptNewCount: number;

    constructor(
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router,
        private agentService: AgentsService
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
                (x) => x.receiptStatus === 'Receipted'
            );

            console.log('======= Receipt List =======');
            console.log(this.receiptedList);

            this.cancelReceiptList = _.filter(
                receipts,
                (x) => x.receiptStatus === 'Cancelled'
            );

            console.log('======= Cancelled Receipt List =======');
            console.log(this.cancelReceiptList);
            this.receiptNewCount = receipts.length;
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
                id: this._id,
                ...this.receiptForm.value,
                onBehalfOf: this.clientName,
                capturedBy: 'this.user',
                receiptStatus: this.recStatus,
                todayDate: new Date(),
                sourceOfBusiness: 'broker',
                intermediaryName: this.receiptForm.controls.onBehalfOf.value,
            };

            this.receiptNum = this._id;
            await this.receiptService
                .addReceipt(
                    receipt,
                    this.policy.risks[0].insuranceType
                )
                .then((mess) => {
                    this.message.success('Receipt Successfully created');
                    console.log(mess);
                })
                .catch((err) => {
                    this.message.warning('Receipt Failed');
                    console.log(err);
                });
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

    // pop Confirm
    cancel() {}

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
