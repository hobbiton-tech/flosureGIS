import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy, RiskModel, ITimestamp } from '../../models/policy.model';
import { PoliciesService } from '../../services/policies.service';
import {
    IPaymentModel,
    PolicyPaymentPlan,
    InstallmentsModel,
} from 'src/app/accounts/components/models/payment-plans.model';
import { v4 } from 'uuid';
import { PaymentPlanService } from 'src/app/accounts/services/payment-plan.service';
import { AccountService } from 'src/app/accounts/services/account.service';

@Component({
    selector: 'app-policy-details',
    templateUrl: './policy-details.component.html',
    styleUrls: ['./policy-details.component.scss'],
})
export class PolicyDetailsComponent implements OnInit {
    isVisible = false;
    policyDetailsForm: FormGroup;
    paymentPlanForm: FormGroup;

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
    isCertificatePDFVisible = true;
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
        { label: 'Payment Plan', value: 'plan' },
    ];
    selectedValue = 'fully';
    formattedDate: any;
    planId: string;

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
            initialInstallmentAmount: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe((param) => {
            this.policyNumber = param.policyNumber;
            this.policiesService.getPolicies().subscribe((policies) => {
                this.policyData = policies.filter(
                    (x) => x.policyNumber === this.policyNumber
                )[0];
                this.policiesList = policies;
                this.policy = this.policiesList.filter(
                    (x) => x.policyNumber === this.policyNumber
                )[0];
                this.displayPolicy = this.policy;
                this.risks = this.displayPolicy.risks;

                this.policyRisk = this.displayPolicy.risks[0];
                this.clientName = this.displayPolicy.client;
                this.clientNumber = '+260976748392';
                this.clientEmail = this.clientName + '@gmail.com'; // TODO: Track client data
                this.agency = 'Direct'; // TODO: Track this guy too
                this.coverForm = this.displayPolicy.startDate.toString();
                this.coverTo = this.displayPolicy.endDate.toString();
                // this.basicPremium = this.displayPolicy
                this.loadingAmount = '-';
                this.discountAmount = '-';
                this.totalAmount = this.displayPolicy.netPremium.toString();
                this.issueDate = this.displayPolicy.dateOfIssue.toString();
                this.issueTime = this.displayPolicy.dateOfIssue.toString();

                this.risksLoading = false;
            });
        });

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
            town: ['', Validators.required],
        });

        // set values of fields
        this.policiesService.getPolicies().subscribe((policies) => {
            this.policyData = policies.filter(
                (x) => x.policyNumber === this.policyNumber
            )[0];
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
        });
    }

    getTimeStamp(policy: Policy): number {
        return (policy.startDate as ITimestamp).seconds;
    }

    getEndDateTimeStamp(policy: Policy): number {
        return (policy.endDate as ITimestamp).seconds;
    }

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
            this.policyUpdate = policyData;
            // Get enddate
            const eDate = this.paymentPlanForm.controls.startDate.value;
            eDate.setMonth(
                eDate.getMonth() +
                    this.paymentPlanForm.controls.numberOfInstallments.value
            );
            this.formattedDate = eDate.toISOString().slice(0, 10);
            // Create installments
            const iAmount =
                policyData.netPremium /
                this.paymentPlanForm.controls.numberOfInstallments.value;
            const installment: InstallmentsModel[] = [];

            for (
                let i = 0;
                i < this.paymentPlanForm.controls.numberOfInstallments.value;
                i++
            ) {
                const iDate = this.paymentPlanForm.controls.startDate.value;
                iDate.setMonth(eDate.getMonth() + i);
                const fDate = iDate.toISOString().slice(0, 10);

                installment.push({
                    installmentAmount: iAmount,
                    installmentDate: fDate,
                    balance: iAmount,
                    installmentStatus: 'UnPaid',
                });
            }

            // initialize Policy plan
            const policyPlan: PolicyPaymentPlan[] = [];
            policyPlan.push({
                ...this.paymentPlanForm.value,
                policyNumber: policyData.policyNumber,
                amountDue: policyData.netPremium,
                premium: policyData.netPremium,
                amountPaid: 0,
                numberOfPaidInstallments: 0,
                amountOutstanding: policyData.netPremium,
                policyPlanStatus: 'Unpaid',
                endDate: this.formattedDate,
                remainingInstallments: this.paymentPlanForm.controls
                    .numberOfInstallments.value,
                installments: installment,
            });
            // Payment Plan
            this.planId = v4();
            const plan: IPaymentModel = {
                id: this.planId,
                clientName: policyData.client,
                clientId: '',
                numberOfPolicies: 1,
                totalPremium: policyData.netPremium,
                status: 'UnPaid',
                policyPaymentPlan: policyPlan,
            };
            // add payment plan
            this.paymentPlanService.addPaymentPlan(plan);
            this.paymentPlanForm.reset();
            this.policyUpdate.paymentPlan = 'Created';
            this.receiptService.updatePolicy(this.policyUpdate);
            this.router.navigateByUrl(
                'flosure/accounts/payment-plan/' + this.planId
            );
        } else if (this.selectedValue === 'fully') {
            this.router.navigateByUrl('/flosure/accounts/receipts');
        }

        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }
}
