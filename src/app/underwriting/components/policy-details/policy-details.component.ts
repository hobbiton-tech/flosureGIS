import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy, RiskModel, ITimestamp } from '../../models/policy.model';
import { PoliciesService } from '../../services/policies.service';
import { DatePipe } from '@angular/common';
// import { generatePolicies } from '../../data/policy.data';

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

    paymentPlan = 'NotCreated';

    // risks
    risks: RiskModel[];

    searchString: string;

    isEditmode = false;

    showCertModal = false;
    showDebitModal = false;
    showReceiptModal = false;

    optionList = [
        { label: 'Full Payment', value: 'fully' },
        { label: 'Payment Plan', value: 'plan' },
    ];
    selectedValue = 'fully';

    constructor(
        private readonly router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService
    ) {
        this.paymentPlanForm = this.formBuilder.group({
            numberOfInstallments: ['', Validators.required],
            initialInstallmentDate: ['', Validators.required],
            initialInstallmentAmount: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        // this.policiesService.getPolicies().subscribe(policies => {
        //     this.policyData = policies.filter(x => x.policyNumber === this.policyNumber)[0];
        //     this.policiesList = policies;
        // });

        // get policy number from url parameter
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
            // this.policyDetailsForm.get('town').setValue(this.policyData.town);
            // this.policyDetailsForm.get('branch').setValue(this.policyData.branch);
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

    handleOk(): void {
        console.log('Button ok clicked!');
        this.isVisible = false;
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
    }
}
