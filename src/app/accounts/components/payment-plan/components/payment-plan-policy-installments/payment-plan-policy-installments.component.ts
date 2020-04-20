import { Component, OnInit } from '@angular/core';
import {
    InstallmentsModel,
    IPaymentModel,
} from '../../../models/payment-plans.model';

import { ActivatedRoute, Router } from '@angular/router';

import { PaymentPlanService } from 'src/app/accounts/services/payment-plan.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { IReceiptModel } from '../../../models/receipts.model';
import { v4 } from 'uuid';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    IIndividualClient,
    ICorporateClient,
} from 'src/app/clients/models/clients.model';
import * as _ from 'lodash';

@Component({
    selector: 'app-payment-plan-policy-installments',
    templateUrl: './payment-plan-policy-installments.component.html',
    styleUrls: ['./payment-plan-policy-installments.component.scss'],
})
export class PaymentPlanPolicyInstallmentsComponent implements OnInit {
    receiptForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    submitted = false;
    today = new Date();

    //
    clientName = '';
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
    paymentPlanPolicyData: Policy = new Policy();

    // payment plan policy installment data
    paymentPlanPolicyInstallmentData: InstallmentsModel = new InstallmentsModel();

    clientN: ICorporateClient;

    // payment plan policies
    paymentPlanPolicies: Policy[] = [];

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
    client: IIndividualClient & ICorporateClient;

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

    displayPoliciesList: Policy[];

    constructor(
        private route: ActivatedRoute,
        private paymentPlanService: PaymentPlanService,
        private receiptService: AccountService,
        private policyService: PoliciesService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router,
        private clientsService: ClientsService
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
        this.route.params.subscribe((param) => {
            this.paymentPlanId = param.id;
            this.policyNumber = param.policyNumber;

            this.paymentPlanService
                .getPaymentPlans()
                .subscribe((paymentPlans) => {
                    this.paymentPlanData = paymentPlans.filter(
                        (x) => x.id === this.paymentPlanId
                    )[0];

                    // this.paymentPlanPolicyData = this.paymentPlanData.policyPaymentPlan.filter(
                    //     (x) => x.policyNumber === this.policyNumber
                    // )[0];

                    this.paymentPlanPolicyInstallments = this.paymentPlanData.installments;
                    this.paymentPlanPolicyInstallmentsCount = this.paymentPlanData.installments.length;

                    this.displayPoliciesList = this.paymentPlanData.policyPaymentPlan;

                    console.log(this.paymentPlanData.policyPaymentPlan);

                    console.log(this.paymentPlanPolicyInstallments);

                    this.clientsService
                        .getCorporateClients()
                        .subscribe((clients) => {
                            console.log(clients);
                            this.clientN = clients.filter(
                                (x) =>
                                    x.companyName ===
                                    this.paymentPlanData.clientName
                            )[0];
                            console.log(this.clientN);

                            // this.client = [...clients[1], ...clients[0]].filter(
                            //     (x) => x.f === this.id
                            // )[0] as IIndividualClient & ICorporateClient;

                            // console.log('CLIENTS', this.client);
                        });
                });
            this.policyService.getPolicies().subscribe((policies) => {
                this.policy = policies.filter(
                    (x) => x.policyNumber === this.policyNumber
                )[0];
            });
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.router.navigateByUrl(
            '/flosure/underwriting/policy-details/' + policy.policyNumber
        );
    }

    showModal(paymentPlanPolicyInstallment: InstallmentsModel): void {
        this.isVisible = true;
        // this.clientName = unreceipted.client;
        // this.policyNumber = unreceipted.policyNumber;
        this.user = 'Chalres Malama';
        // this.policy = unreceipted;
        this.receiptForm
            .get('sumInDigits')
            .setValue(paymentPlanPolicyInstallment.balance);
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
            const amount = this.receiptForm.controls.sumInDigits.value;
            let count = 0;
            this.isOkLoading = true;
            this._id = v4();
            const receipt: IReceiptModel = {
                id: this._id,
                ...this.receiptForm.value,
                onBehalfOf: this.paymentPlanData.clientName,
                capturedBy: this.user,
                policyNumber: this.policyNumber,
                receiptStatus: this.recStatus,
                sumInDigits: amount,
                todayDate: new Date(),
            };
            this.receiptNum = this._id;
            await this.receiptService.addReceipt(receipt);

            const p = this.paymentPlanPolicyInstallments;
            let d = amount;

            this.paymentPlanData.amountOutstanding =
                this.paymentPlanData.amountOutstanding - amount;
            this.paymentPlanData.amountPaid =
                this.paymentPlanData.amountPaid + amount;
            if (this.paymentPlanData.amountOutstanding !== 0) {
                this.paymentPlanData.status = 'Partially Paid';
            } else if (this.paymentPlanData.amountOutstanding >= 0) {
                this.paymentPlanData.status = 'Fully Paid';
            }
            for (let i = 0; i < p.length; i++) {
                console.log(d);

                if (d > p[i].balance && p[i].balance !== 0) {
                    d = d - p[i].balance;
                    p[i].balance = 0;
                    p[i].installmentStatus = 'Fully Paid';
                    p[i].actualPaidDate = this.today;
                    count++;
                    this.paymentPlanData.numberOfPaidInstallments =
                        this.paymentPlanData.numberOfPaidInstallments + count;
                    this.paymentPlanData.remainingInstallments =
                        this.paymentPlanData.remainingInstallments - count;
                    // this.isVisible = false;
                }
                if (d < p[i].balance && p[i].balance !== 0) {
                    p[i].balance = p[i].balance - d;
                    p[i].installmentStatus = 'Partially Paid';
                    p[i].actualPaidDate = this.today;
                    console.log(count);

                    break;
                }

                if (d === p[i].balance && p[i].balance !== 0) {
                    p[i].balance = p[i].balance - d;
                    p[i].installmentStatus = 'Fully Paid';
                    p[i].actualPaidDate = this.today;
                    count++;
                    this.paymentPlanData.numberOfPaidInstallments =
                        this.paymentPlanData.numberOfPaidInstallments + count;
                    this.paymentPlanData.remainingInstallments =
                        this.paymentPlanData.remainingInstallments - count;
                    console.log(count);
                    break;
                }
            }
            this.receiptForm.reset();
            setTimeout(() => {
                this.isVisible = false;
                this.isOkLoading = false;
            }, 30);
            this.policy.receiptStatus = 'Receipted';
            console.log('<++++++++++++++++++CLAIN+++++++++>');
            console.log(this.policy);
            await this.receiptService.updatePolicy(this.policy);
            await this.paymentPlanService.updatePaymentPlan(
                this.paymentPlanData
            );
            this.generateID(this._id);
        }
    }

    generateID(id) {
        console.log('++++++++++++ID++++++++++++');
        this._id = id;
        console.log(this._id);
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + this._id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }
}
