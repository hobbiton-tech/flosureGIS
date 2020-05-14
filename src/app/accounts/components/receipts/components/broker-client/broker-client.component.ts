import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { IAgent } from 'src/app/settings/components/agents/models/agents.model';
import { IReceiptModel } from '../../../models/receipts.model';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import _ from 'lodash';
import { v4 } from 'uuid';

@Component({
    selector: 'app-broker-client',
    templateUrl: './broker-client.component.html',
    styleUrls: ['./broker-client.component.scss'],
})
export class BrokerClientComponent implements OnInit {
    receiptForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    submitted = false;
    receiptsCount = 0;
    unreceiptedList: Policy[];
    brokerList: IAgent[];
    receiptedList: IReceiptModel[];
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

    isVisible = false;
    isCancelVisible = false;
    isReinstateVisible = false;
    isOkLoading = false;
    policyNumber = '';
    user = '';
    _id = '';
    isVisibleClientType = false;
    isOkClientTypeLoading = false;
    agent: any;

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

    typeOfClient = ['Direct', 'Agent', 'Broker'];

    selectedType = 'Direct';
    selectedBroker = '';
    listofUnreceiptedReceipts: Policy[];
    displayedListOfUnreceiptedReceipts: Policy[];
    sourceOfBusiness: string;
    intermediaryName: string;

    constructor(
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router,
        private agentService: AgentsService
    ) {
        this.receiptForm = this.formBuilder.group({
            receivedFrom: ['', Validators.required],
            // sumInDigits: [this.policyAmount],
            paymentMethod: ['', Validators.required],
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
            this.listofUnreceiptedReceipts = _.filter(
                quotes,
                (x) =>
                    x.receiptStatus === 'Unreceipted' &&
                    x.sourceOfBusiness === 'broker'
            );

            this.displayedListOfUnreceiptedReceipts = this.listofUnreceiptedReceipts;

            this.receiptsCount = _.filter(
                quotes,
                (x) =>
                    x.receiptStatus === 'Unreceipted' &&
                    x.sourceOfBusiness === 'broker'
            ).length;
            console.log('======= Unreceipt List =======');
            console.log(this.listofUnreceiptedReceipts);
        });

        this.receiptService.getReciepts().subscribe((receipts) => {
            this.receiptedList = _.filter(
                receipts,
                (x) =>
                    x.receiptStatus === 'Receipted' &&
                    x.sourceOfBusiness === 'broker'
            );

            console.log('======= Receipt List =======');
            console.log(this.receiptedList);

            this.cancelReceiptList = _.filter(
                receipts,
                (x) =>
                    x.receiptStatus === 'Cancelled' &&
                    x.sourceOfBusiness === 'broker'
            );

            console.log('======= Cancelled Receipt List =======');
            console.log(this.cancelReceiptList);
        });
    }

    log(value): void {
        // this.listOfPolicies = this.policies.filter((x) => x.client === value);
        this.displayedListOfUnreceiptedReceipts = this.listofUnreceiptedReceipts.filter(
            (x) => x.intermediaryName === value
        );
        console.log(value);
    }

    showModal(unreceipted: Policy): void {
        this.isVisible = true;
        this.clientName = unreceipted.client;
        this.policyNumber = unreceipted.policyNumber;
        this.user = unreceipted.user;
        this.policy = unreceipted;
        this.policyAmount = unreceipted.netPremium;
        this.sourceOfBusiness = unreceipted.sourceOfBusiness;
        this.intermediaryName = unreceipted.intermediaryName;
        console.log(this.policyAmount);
    }

    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    async handleOk() {
        this.submitted = true;
        if (this.receiptForm.valid) {
            this.isOkLoading = true;
            this._id = v4();
            const receipt: IReceiptModel = {
                id: this._id,
                ...this.receiptForm.value,
                onBehalfOf: this.clientName,
                capturedBy: this.user,
                policyNumber: this.policyNumber,
                receiptStatus: this.recStatus,
                sumInDigits: this.policyAmount,
                todayDate: new Date(),
                sourceOfBusiness: this.sourceOfBusiness,
                intermediaryName: this.intermediaryName,
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

            this.policy.receiptStatus = 'Receipted';
            this.policy.paymentPlan = 'Created';
            console.log('<++++++++++++++++++CLAIN+++++++++>');
            console.log(this.policy);

            await this.receiptService.updatePolicy(this.policy);

            this.generateID(this._id);
        }
    }

    handleCancel(): void {
        this.isVisible = false;
    }
    showCancelModal(receipt: IReceiptModel) {
        this.isCancelVisible = true;
        this.cancelReceipt = receipt;
    }

    cancelCancellation() {
        this.isCancelVisible = false;
    }

    async onCancel() {
        this.cancelReceipt.receiptStatus = 'Cancelled';
        this.cancelReceipt.remarks = this.cancelForm.controls.remarks.value;
        console.log('<++++++++++++++++++CLAIN+++++++++>');
        console.log(this.cancelReceipt);
        await this.receiptService.updateReceipt(this.cancelReceipt);
        this.isCancelVisible = false;
    }

    showReinstateModal(receipt: IReceiptModel) {
        this.isReinstateVisible = true;
        this.reinstateReceipt = receipt;
    }

    cancelReinstate() {
        this.isReinstateVisible = false;
    }

    async onReinstate() {
        this.reinstateReceipt.receiptStatus = 'Receipted';
        this.reinstateReceipt.remarks = this.cancelForm.controls.remarks.value;
        console.log('<++++++++++++++++++CLAIN+++++++++>');
        console.log(this.reinstateReceipt);
        await this.receiptService.updateReceipt(this.reinstateReceipt);
        this.isReinstateVisible = false;
    }

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
        this.isOkClientTypeLoading = true;
        setTimeout(() => {
            this.isVisible = false;
            this.isOkClientTypeLoading = false;
        }, 3000);
    }

    handleCancelClientType(): void {
        this.isVisibleClientType = false;
    }
}
