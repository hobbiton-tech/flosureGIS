import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { IReceiptModel } from '../../../models/receipts.model';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import _ from 'lodash';
import { v4 } from 'uuid';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import { IAgent } from 'src/app/settings/components/agents/models/agents.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { DebitNote } from 'src/app/underwriting/documents/models/documents.model';

@Component({
    selector: 'app-agent-client',
    templateUrl: './agent-client.component.html',
    styleUrls: ['./agent-client.component.scss'],
})
export class AgentClientComponent implements OnInit {
    receiptForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    submitted = false;
    receiptsCount = 0;
    unreceiptedList: Policy[];
    agentList: IAgent[];
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
    selectedAgent: any;
    listofUnreceiptedReceipts: Policy[];
    displayedListOfUnreceiptedReceipts: Policy[];
    sourceOfBusiness: string;
    intermediaryName: string;
    receiptNewCount: any;
    debitnoteList: DebitNote[] = [];
    debitnote: DebitNote;
    paymentMethod = '';
    currency: string;

    constructor(
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router,
        private agentService: AgentsService,
        private policeServices: PoliciesService
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
            cheqNumber: [''],
        });

        this.cancelForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
        this.reinstateForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.agentService.getAgents().subscribe((agents) => {
            this.agentList = agents;

            console.log('===================');
            console.log(this.agentList);
        });
        this.policeServices.getPolicies().subscribe((quotes) => {
            this.listofUnreceiptedReceipts = _.filter(
                quotes,
                (x) =>
                    x.receiptStatus === 'Unreceipted' &&
                    x.sourceOfBusiness === 'agent'
            );
            this.displayedListOfUnreceiptedReceipts = this.listofUnreceiptedReceipts;

            this.receiptsCount = _.filter(
                quotes,
                (x) =>
                    x.receiptStatus === 'Unreceipted' &&
                    x.sourceOfBusiness === 'agent'
            ).length;
            console.log('======= Unreceipt List =======');
            console.log(this.listofUnreceiptedReceipts);
        });

        this.policeServices.getDebitNotes().subscribe((invoice) => {
            this.debitnoteList = invoice;
        });

        this.receiptService.getReciepts().subscribe((receipts) => {
            this.receiptedList = _.filter(
                receipts,
                (x) =>
                    x.receiptStatus === 'Receipted' &&
                    x.sourceOfBusiness === 'agent'
            );

            console.log('======= Receipt List =======');
            console.log(this.receiptedList);

            this.cancelReceiptList = _.filter(
                receipts,
                (x) =>
                    x.receiptStatus === 'Cancelled' &&
                    x.sourceOfBusiness === 'agent'
            );

            console.log('======= Cancelled Receipt List =======');
            console.log(this.cancelReceiptList);
            this.receiptNewCount = receipts.length;
        });
    }

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

    log(value): void {
        console.log('Receipts', this.listofUnreceiptedReceipts);

        this.displayedListOfUnreceiptedReceipts = this.listofUnreceiptedReceipts.filter(
            (x) => x.intermediaryName === value
        );
        console.log(this.listofUnreceiptedReceipts);
        console.log('SELECRED', value);
    }

    showModal(unreceipted: Policy): void {
        this.isVisible = true;
        this.clientName = unreceipted.client;
        this.policyNumber = unreceipted.policyNumber;
        this.user = unreceipted.user;
        this.policy = unreceipted;
        this.debitnote = this.debitnoteList.filter(
            (x) => x.policy.id === unreceipted.id
        )[0];
        this.policyAmount = unreceipted.netPremium;
        this.currency = unreceipted.currency;
        this.sourceOfBusiness = unreceipted.sourceOfBusiness;
        this.intermediaryName = unreceipted.intermediaryName;
        console.log(this.policyAmount);
    }

    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    async handleOk() {
        this.submitted = true;
        console.log('DEBIT NOTE NUMBER>>>>>', this.debitnote.debitNoteNumber);
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
                invoiceNumber: this.debitnote.debitNoteNumber,
                sourceOfBusiness: this.sourceOfBusiness,
                intermediaryName: this.intermediaryName,
                currency: this.currency,
            };

            this.receiptNum = this._id;
            await this.receiptService
                .addReceipt(
                    receipt,
                    this.policy.risks[0].insuranceType,
                    this.receiptNewCount
                )
                .then((mess) => {
                    this.message.success('Receipt Successfully created');
                    this.policy.receiptStatus = 'Receipted';
                    this.policy.paymentPlan = 'Created';
                    console.log('<++++++++++++++++++CLAIN+++++++++>');
                    console.log(this.policy);

                    this.policeServices.updatePolicy(this.policy).subscribe();
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

    method(value) {
        this.paymentMethod = value;
    }
}
