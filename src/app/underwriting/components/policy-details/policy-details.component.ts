import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy, ITimestamp } from '../../models/policy.model';
import { PoliciesService } from '../../services/policies.service';
import {
    IPaymentModel,
    InstallmentsModel,
    PlanReceipt
} from 'src/app/accounts/components/models/payment-plans.model';
import { v4 } from 'uuid';
import { PaymentPlanService } from 'src/app/accounts/services/payment-plan.service';
import { AccountService } from 'src/app/accounts/services/account.service';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { IReceiptModel } from 'src/app/accounts/components/models/receipts.model';

@Component({
    selector: 'app-policy-details',
    templateUrl: './policy-details.component.html',
    styleUrls: ['./policy-details.component.scss']
})
export class PolicyDetailsComponent implements OnInit {
    isVisible = false;
    policyDetailsForm: FormGroup;
    paymentPlanForm: FormGroup;
    policydata: Policy[] = [];

    policiesList: Policy[];
    policyNumber: string;
    policyData: Policy = new Policy();
    policy: Policy;
    displayPolicy: Policy;
    policyUpdate: Policy = new Policy();
    isLoading = false;

    paymentPlan = 'NotCreated';

    // risks
    risks: RiskModel[] = [];
    risksLoading = true;

    searchString: string;

    isEditmode = false;

    // PDFS
    isCertificatePDFVisible = false;
    isDebitNotePDFVisible = false;
    isSchedulePDFVisible = false;
    isClausesPDFVisible = false;

    // For Modal
    clientName: string;
    clientNumber: string;
    clientEmail: string;
    policyRisk: RiskModel;
    issueDate: string;
    issueTime: string;
    agency: string;
    classOfBusiness: string;
    coverForm: string;
    coverTo: string;
    basicPremium: string;
    loadingAmount: string;
    discountAmount: string;
    totalAmount: string;

    optionList = [
        { label: 'Full Payment', value: 'fully' },
        { label: 'Payment Plan', value: 'plan' }
    ];
    selectedValue = 'fully';
    formattedDate: any;
    planId: string;
    // clientName: any;
    netPremium: any;
    formattedeDate: Date;
    _id: string;

    constructor(
        private readonly router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private paymentPlanService: PaymentPlanService,
        private receiptService: AccountService
    ) {
        this.paymentPlanForm = this.formBuilder.group({
            numberOfInstallments: ['', Validators.required],
            startDate: ['', Validators.required],
            initialInstallmentAmount: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id['id']).subscribe(policy => {
                console.log('CHECKING ID GET', policy);
                this.policyData = policy;

                this.risks = policy.risks;

                this.policyRisk = policy.risks[0];
                this.clientName = policy.client;
                this.clientNumber = '+260976748392';
                this.clientEmail = policy.client + '@gmail.com'; // TODO: Track client data
                this.agency = 'Direct'; // TODO: Track this guy too
                this.coverForm = policy.startDate.toString();
                this.coverTo = policy.endDate.toString();
                // this.basicPremium = this.policy
                this.loadingAmount = '-';
                this.discountAmount = '-';
                this.totalAmount = policy.netPremium.toString();
                this.issueDate = policy.dateOfIssue.toString();
                this.issueTime = policy.dateOfIssue.toString();

                // set values of fields
                this.policyDetailsForm
                    .get('client')
                    .setValue(this.policyData.client);
                this.policyDetailsForm
                    .get('nameOfInsured')
                    .setValue(this.policyData.nameOfInsured);
                this.policyDetailsForm
                    .get('startDate')
                    .setValue(this.policyData.startDate);
                this.policyDetailsForm
                    .get('endDate')
                    .setValue(this.policyData.endDate);
                this.policyDetailsForm
                    .get('sumInsured')
                    .setValue(this.policyData.sumInsured);
                this.policyDetailsForm
                    .get('netPremium')
                    .setValue(this.policyData.netPremium);
                this.policyDetailsForm
                    .get('currency')
                    .setValue(this.policyData.currency);
                this.policyDetailsForm
                    .get('timeOfIssue')
                    .setValue(this.policyData.timeOfIssue);
                this.policyDetailsForm
                    .get('dateOfIssue')
                    .setValue(this.policyData.dateOfIssue);
                this.policyDetailsForm
                    .get('expiryDate')
                    .setValue(this.policyData.endDate);
                this.policyDetailsForm
                    .get('quarter')
                    .setValue(this.policyData.quarter);

                this.risksLoading = false;
            });
        });
        // this.route.data.subscribe((data: Policy) => {
        //     console.log('RESOLVED', data);
        //     this.route.params.subscribe((param) => {
        //         this.policyNumber = param.policyNumber;
        //         this.policiesService.getPolicies().subscribe((policies) => {

        //         });
        //     });
        // });
        // policy details form
        this.policyDetailsForm = this.formBuilder.group({
            client: ['', Validators.required],
            nameOfInsured: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            product: ['', Validators.required],
            sumInsured: ['', Validators.required],
            netPremium: ['', Validators.required],
            currency: ['', Validators.required],
            branch: ['', Validators.required],
            timeOfIssue: ['', Validators.required],
            dateOfIssue: ['', Validators.required],
            expiryDate: ['', Validators.required],
            quarter: ['', Validators.required],
            town: ['', Validators.required]
        });

        // set values of fields
        // this.policiesService.getPolicies().subscribe((policies) => {
        //     this.policyData = policies.filter(
        //         (x) => x.policyNumber === this.policyNumber
        //     )[0];
        //     this.policyDetailsForm
        //         .get('client')
        //         .setValue(this.policyData.client);
        //     this.policyDetailsForm
        //         .get('nameOfInsured')
        //         .setValue(this.policyData.nameOfInsured);
        //     this.policyDetailsForm
        //         .get('startDate')
        //         .setValue(this.policyData.startDate);
        //     this.policyDetailsForm
        //         .get('endDate')
        //         .setValue(this.policyData.endDate);
        //     this.policyDetailsForm
        //         .get('sumInsured')
        //         .setValue(this.policyData.sumInsured);
        //     this.policyDetailsForm
        //         .get('netPremium')
        //         .setValue(this.policyData.netPremium);
        //     this.policyDetailsForm
        //         .get('currency')
        //         .setValue(this.policyData.currency);
        //     this.policyDetailsForm
        //         .get('timeOfIssue')
        //         .setValue(this.policyData.timeOfIssue);
        //     this.policyDetailsForm
        //         .get('dateOfIssue')
        //         .setValue(this.policyData.dateOfIssue);
        //     this.policyDetailsForm
        //         .get('expiryDate')
        //         .setValue(this.policyData.endDate);
        //     this.policyDetailsForm
        //         .get('quarter')
        //         .setValue(this.policyData.quarter);
        // });
    }

    // getTimeStamp(policy: Policy): number {
    //     return (policy.startDate as ITimestamp).seconds;
    // }

    // getEndDateTimeStamp(policy: Policy): number {
    //     return (policy.endDate as ITimestamp).seconds;
    // }

    goToPoliciesList(): void {
        this.router.navigateByUrl('/flosure/underwriting/policies');
    }

    goToClientsList(): void {
        this.router.navigateByUrl('/flosure/clients/clients-list');
    }

    showModal(policy: Policy): void {
        this.isVisible = true;
    }

    handleOk(policyData): void {
        if (this.selectedValue === 'plan') {
            let pAmount = 0;
            let policyCount = 0;
            const policyPlan: Policy[] = [];
            policyPlan.push({
                ...policyData
            });

            this.policyUpdate = policyData;

            pAmount = pAmount + policyData.netPremium;
            policyCount++;

            this.clientName = policyData.client;
            this.netPremium = this.netPremium + policyData.netPremium;
            // this.policyPlan = policyPlan;
            this.policyUpdate.paymentPlan = 'Created';
            this.receiptService.updatePolicy(this.policyUpdate);

            const eDate = new Date(
                this.paymentPlanForm.controls.startDate.value
            );
            eDate.setMonth(
                eDate.getMonth() +
                    this.paymentPlanForm.controls.numberOfInstallments.value
            );
            this.formattedeDate = eDate;

            const dAmount =
                pAmount -
                this.paymentPlanForm.controls.initialInstallmentAmount.value;

            // Create installments
            const iAmount =
                dAmount /
                this.paymentPlanForm.controls.numberOfInstallments.value;
            const installment: InstallmentsModel[] = [];

            const iDate = new Date(
                this.paymentPlanForm.controls.startDate.value
            );
            while (iDate <= eDate) {
                iDate.setMonth(iDate.getMonth() + 1);
                this.formattedDate = iDate;

                installment.push({
                    installmentAmount: iAmount,
                    installmentDate: this.formattedDate,
                    balance: iAmount,
                    installmentStatus: 'UnPaid'
                });
            }

            // Payment Plan
            const pDate = new Date(
                this.paymentPlanForm.controls.startDate.value
            );
            console.log('THis', this.policyData);

            this.planId = v4();
            const plan: IPaymentModel = {
                ...this.paymentPlanForm.value,
                id: this.planId,
                clientId: '',
                clientName: policyData.client,
                numberOfPolicies: policyCount,
                totalPremium: pAmount,
                status: 'UnPaid',
                policyPaymentPlan: policyPlan,
                remainingInstallments: this.paymentPlanForm.controls
                    .numberOfInstallments.value,
                amountPaid: 0,
                numberOfPaidInstallments: 0,
                amountOutstanding: dAmount,
                installments: installment,
                startDate: pDate,
                endDate: this.formattedeDate
            };

            console.log('..........Payment Plan..........');
            console.log(plan);

            this._id = v4();
            const receipt: IReceiptModel = {
                id: this._id,
                paymentMethod: '',
                receivedFrom: this.paymentPlanForm.controls.clientName.value,
                onBehalfOf: this.paymentPlanForm.controls.clientName.value,
                capturedBy: 'charles malama',
                policyNumber: '',
                receiptStatus: 'Receipted',
                narration: 'Payment Plan',
                receiptType: 'Premium Payment',
                sumInDigits: this.paymentPlanForm.controls
                    .initialInstallmentAmount.value,
                todayDate: new Date()
            };

            const planReceipt: PlanReceipt[] = [];
            planReceipt.push({
                id: this._id,
                onBehalfOf: this.paymentPlanForm.controls.clientName.value,
                allocationStatus: 'Unallocated',
                sumInDigits: this.paymentPlanForm.controls
                    .initialInstallmentAmount.value,
                policyNumber: ''
            });

            plan.planReceipt = planReceipt;
            console.log('=====================');

            console.log(receipt, plan);

            // add payment plan
            this.paymentPlanService.addPaymentPlanReceipt(receipt, plan);

            // add payment plan
            // this.paymentPlanService.addPaymentPlan(plan);
            this.paymentPlanForm.reset();
            this.isVisible = false;
            this.router.navigateByUrl('flosure/accounts/payment-plan');
        } else if (this.selectedValue === 'fully') {
            this.router.navigateByUrl('/flosure/accounts/receipts');
        }

        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }
}
