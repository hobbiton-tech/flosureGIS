import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { IReceiptModel } from '../../../models/receipts.model';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import _ from 'lodash';
import { v4 } from 'uuid';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';

@Component({
    selector: 'app-direct-client',
    templateUrl: './direct-client.component.html',
    styleUrls: ['./direct-client.component.scss']
})
export class DirectClientComponent implements OnInit {
    receiptForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    submitted = false;
    receiptsCount = 0;
    unreceiptedList: Policy[];
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
            value: 'Imprest Retirement Receipt'
        },
        { label: 'Third Party Recovery', value: 'Third Party Recovery' },
        { label: 'General Receipt', value: 'General Receipt' }
    ];

    paymentMethodList = [
        { label: 'Cash', value: 'cash' },
        { label: 'EFT', value: 'eft' },
        { label: 'Bank Transfer', value: 'bank transfer' }
    ];
    sourceOfBusiness: string;
    intermediaryName: string;
    constructor(
        private receiptService: AccountService,
        private policeServices: PoliciesService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router
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
            remarks: ['']
        });

        this.cancelForm = this.formBuilder.group({
            remarks: ['', Validators.required]
        });
        this.reinstateForm = this.formBuilder.group({
            remarks: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.policeServices.getPolicies().subscribe(quotes => {
            this.unreceiptedList = _.filter(
                quotes,
                x =>
                    x.receiptStatus === 'Unreceipted' &&
                    x.sourceOfBusiness === 'direct'
            );
            this.receiptsCount = _.filter(
                quotes,
                x =>
                    x.receiptStatus === 'Unreceipted' &&
                    x.sourceOfBusiness === 'direct'
            ).length;
            console.log('======= Unreceipt List =======');
            console.log(this.unreceiptedList);
        });

        this.receiptService.getReciepts().subscribe(receipts => {
            this.receiptedList = _.filter(
                receipts,
                x =>
                    x.receiptStatus === 'Receipted' &&
                    x.sourceOfBusiness === 'direct'
            );

            console.log('======= Receipt List =======');
            console.log(this.receiptedList);

            this.cancelReceiptList = _.filter(
                receipts,
                x =>
                    x.receiptStatus === 'Cancelled' &&
                    x.sourceOfBusiness === 'direct'
            );

            console.log('======= Cancelled Receipt List =======');
            console.log(this.cancelReceiptList);
        });
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
                intermediaryName: 'direct'
            };

            this.receiptNum = this._id;
            await this.receiptService
                .addReceipt(receipt, this.policy.risks[0].insuranceType)
                .then(mess => {
                    this.message.success('Receipt Successfully created');
                    console.log(mess);
                })
                .catch(err => {
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
                this.isVisible = false;
                this.isOkLoading = false;
            }, 3000);
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
}
