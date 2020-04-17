import { Component, OnInit } from '@angular/core';
import {
    InstallmentsModel,
    IPaymentModel,
    PolicyPaymentPlan
} from '../../../models/payment-plans.model';

import { ActivatedRoute, Router } from '@angular/router';

import { PaymentPlanService } from 'src/app/accounts/services/payment-plan.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { IReceiptModel } from '../../../models/receipts.model';
import { v4 } from 'uuid';
import { Policy } from 'src/app/underwriting/models/policy.model';

@Component({
    selector: 'app-payment-plan-policy-installments',
    templateUrl: './payment-plan-policy-installments.component.html',
    styleUrls: ['./payment-plan-policy-installments.component.scss']
})
export class PaymentPlanPolicyInstallmentsComponent implements OnInit {
    receiptForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    submitted = false;
    today = new Date();

    //
    clientName = 'Joshua Silwembe';
    recStatus = 'Receipted';
    installmentAmount = 0;
    receiptNum = '';
    policy: Policy = new Policy();

    installmentsList: InstallmentsModel[];
    displayInstallmentsList: InstallmentsModel[];

    // payment plan Id
    paymentPlanId: string;

    // policy number
    policyNumber: string;

    // payment plan data
    paymentPlanData: IPaymentModel = new IPaymentModel();

    // payment plan policy data
    paymentPlanPolicyData: PolicyPaymentPlan = new PolicyPaymentPlan();

    // payment plan policy installment data
    paymentPlanPolicyInstallmentData: InstallmentsModel = new InstallmentsModel();

    // payment plan policies
    paymentPlanPolicies: PolicyPaymentPlan[] = [];

    // payment plan policy installments
    paymentPlanPolicyInstallments = [];

    // search value for filtering installment table
    searchString: string;

    // payment plan policy installments
    paymentPlanPolicyInstallmentsCount = 0;

    // Recipting
    isVisible = false;
    isCancelVisible = false;
    isReinstateVisible = false;
    isOkLoading = false;
    // policyNumber = '';
    user = '';
    _id = '';

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

    constructor(
        private route: ActivatedRoute,
        private paymentPlanService: PaymentPlanService,
        private receiptService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router
    ) {
        this.receiptForm = this.formBuilder.group({
            receivedFrom: ['', Validators.required],
            sumInDigits: ['', Validators.required],
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
        this.route.params.subscribe(param => {
            this.paymentPlanId = param.id;
            this.policyNumber = param.policyNumber;

            this.paymentPlanService
                .getPaymentPlans()
                .subscribe(paymentPlans => {
                    this.paymentPlanData = paymentPlans.filter(
                        x => x.id === this.paymentPlanId
                    )[0];

                    this.paymentPlanPolicyData = this.paymentPlanData.policyPaymentPlan.filter(
                        x => x.policyNumber === this.policyNumber
                    )[0];

                    this.paymentPlanPolicyInstallments = this.paymentPlanPolicyData.installments;
                    console.log('000000000Installments0000000000');
                    console.log(this.paymentPlanPolicyInstallments);
                    this.paymentPlanPolicyInstallmentsCount = this.paymentPlanPolicyData.installments.length;
                    console.log('000000000Number0000000000');
                    console.log(this.paymentPlanPolicyInstallmentsCount);
                });
        });
    }

    showModal(paymentPlanPolicyInstallment: InstallmentsModel): void {
        this.isVisible = true;
        // this.clientName = unreceipted.client;
        // this.policyNumber = unreceipted.policyNumber;
        this.user = 'Chalres Malama';
        // this.policy = unreceipted;
        this.receiptForm
            .get('sumInDigits')
            .setValue(paymentPlanPolicyInstallment.installmentAmount);
        this.installmentAmount = paymentPlanPolicyInstallment.installmentAmount;
    }

    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    receiptInstallment() {}

    // modal cancel
    handleCancel(): void {
        this.isVisible = false;
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
                sumInDigits: this.installmentAmount,
                todayDate: new Date()
            };

            this.receiptNum = this._id;
            await this.receiptService
                .addReceipt(receipt)
                .then(mess => {
                    this.message.success('Receipt Successfully created');
                })
                .catch(err => {
                    this.message.warning('Receipt Failed');
                });
            this.receiptForm.reset();
            setTimeout(() => {
                this.isVisible = false;
                this.isOkLoading = false;
            }, 30);

            this.policy.receiptStatus = 'Receipted';
            const amount = this.receiptForm.controls.sumInDigits.value;
            let d = 0;

            if (this.receiptForm.valid) {
                // this.isOkLoading = true;
                for (const p of this.paymentPlanPolicyInstallments) {
                    d = this.installmentAmount - amount;
                    if (p.balance === amount) {
                        p.balance = d;
                        p.installmentStatus = 'Fully Paid';

                        break;

                        //       this._id = v4();
                        //       const receipt: IReceiptModel = {
                        //     id: this._id,
                        //     ...this.receiptForm.value,
                        //     onBehalfOf: this.clientName,
                        //     capturedBy: this.user,
                        //     policyNumber: this.policyNumber,
                        //     receiptStatus: this.recStatus,
                        //     sumInDigits: amount,
                        //     todayDate: new Date(),
                        // };
                        //       this.receiptNum = this._id;
                        //       await this.receiptService
                        //     .addReceipt(receipt)
                        //       this.receiptForm.reset();
                        //       setTimeout(() => {
                        //     this.isVisible = false;
                        //     this.isOkLoading = false;
                        // }, 30);
                        //       this.policy.receiptStatus = 'Receipted';
                        //       await this.receiptService.updatePolicy(this.policy);
                        //       this.generateID(this._id);

                        console.log(d);
                    } else if (amount > p.balance) {
                        p.balance = d;
                        p.installmentStatus = 'Fully Paid';
                    } else if (amount < p.balance) {
                        p.balance = d;
                        p.installmentStatus = 'Partially Paid';

                        break;
                    } else {
                        p.installmentStatus = 'Fully Paid';
                    }
                    console.log(this.paymentPlanData);
                }
                // this.isOkLoading = true;
                // this._id = v4();
                // const receipt: IReceiptModel = {
                //     id: this._id,
                //     ...this.receiptForm.value,
                //     onBehalfOf: this.clientName,
                //     capturedBy: this.user,
                //     policyNumber: this.policyNumber,
                //     receiptStatus: this.recStatus,
                //     sumInDigits: this.installmentAmount,
                //     todayDate: new Date(),
                // };
                // this.receiptNum = this._id;
                // await this.receiptService
                //     .addReceipt(receipt)
                //     .then((mess) => {
                //         this.message.success('Receipt Successfully created');
                //     })
                //     .catch((err) => {
                //         this.message.warning('Receipt Failed');
                //     });
                // this.receiptForm.reset();
                // setTimeout(() => {
                //     this.isVisible = false;
                //     this.isOkLoading = false;
                // }, 30);
                // this.policy.receiptStatus = 'Receipted';
                // await this.receiptService.updatePolicy(this.policy);
                // this.generateID(this._id);
            }
        }
    }

    generateID(id) {
        this._id = id;
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + this._id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }
}
