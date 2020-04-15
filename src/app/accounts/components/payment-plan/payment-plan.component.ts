import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    IPaymentModel,
    InstallmentsModel,
    PolicyPaymentPlan,
} from '../models/payment-plans.model';
import { PaymentPlanService } from '../../services/payment-plan.service';

import { v4 } from 'uuid';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    IIndividualClient,
    ICorporateClient,
} from 'src/app/clients/models/client.model';

@Component({
    selector: 'app-payment-plan',
    templateUrl: './payment-plan.component.html',
    styleUrls: ['./payment-plan.component.scss'],
})
export class PaymentPlanComponent implements OnInit {
    paymentPlansList: IPaymentModel[];
    dispalyPaymentPlansList: IPaymentModel[];

    policies: any;

    listOfPolicies: any[];
    // number of payment plans
    paymentPlansCount = 0;
    listOfSelectedValue = [];

    policyUpdate: Policy = new Policy();
    clients: Array<IIndividualClient & ICorporateClient>;
    selectedClient: IIndividualClient & ICorporateClient;

    isVisible = false;
    size = 'default';
    searchChange$ = new BehaviorSubject('');
    isLoading = false;
    receiptService: any;
    optionList: string[] = [];

    // search value for filtering payment plan table
    searchString: string;
    selectedValue: string;
    paymentPlanForm: FormGroup;
    formattedDate: any;
    clientName: any;
    netPremium = 0;
    policyPlan: any;
    constructor(
        private router: Router,
        private paymentPlanService: PaymentPlanService,
        private policyService: PoliciesService,
        private readonly clientsService: ClientsService,
        private formBuilder: FormBuilder
    ) {
        this.paymentPlanForm = this.formBuilder.group({
            numberOfInstallments: ['', Validators.required],
            policyNumber: ['', Validators.required],
            startDate: ['', Validators.required],
            initialInstallmentAmount: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.paymentPlanService.getPaymentPlans().subscribe((paymentPlans) => {
            this.paymentPlansList = paymentPlans;
            this.paymentPlansCount = paymentPlans.length;

            this.dispalyPaymentPlansList = this.paymentPlansList;
        });

        this.clientsService.getAllClients().subscribe((clients) => {
            this.clients = [...clients[0], ...clients[1]] as Array<
                IIndividualClient & ICorporateClient
            >;
        });

        this.policyService.getPolicies().subscribe((policies) => {
            this.listOfPolicies = _.filter(
                policies,
                (x) => x.paymentPlan === 'NotCreated'
            );
            this.isLoading = false;
        });
    }

    clientChange(value) {
        console.log('----------this.selectedClient----------');
        console.log(value);
        // this.listOfPolicies = this.policies.filter((x) => x.client === value);
    }

    // view policies of payment plan
    viewPaymentPlanDetails(paymentPlan: IPaymentModel) {
        this.router.navigateByUrl(
            '/flosure/accounts/payment-plan/' + paymentPlan.id
        );
    }

    // add new payment plan
    addPaymentPlan() {}

    // search payment plan table
    search(value: string) {
        if (value === ' ' || !value) {
            this.dispalyPaymentPlansList = this.paymentPlansList;
        }

        this.dispalyPaymentPlansList = this.paymentPlansList.filter(
            (paymentPlan) => {
                return (
                    paymentPlan.clientName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    paymentPlan.clientId
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        );
    }

    showModal(): void {
        this.isVisible = true;
    }

    onSearch(value: string): void {
        this.isLoading = true;
        this.searchChange$.next(value);
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
    }

    handleOk(): void {
        console.log('............Policy Numbers............');
        console.log(this.listOfSelectedValue);

        // Get enddate
        for (const policy of this.listOfSelectedValue) {
            this.policyUpdate = policy;
            const eDate = this.paymentPlanForm.controls.startDate.value;
            eDate.setMonth(
                eDate.getMonth() +
                    this.paymentPlanForm.controls.numberOfInstallments.value
            );
            this.formattedDate = eDate.toISOString().slice(0, 10);
            console.log('!!!!!!!!!!!End Date!!!!!!!!!!!');

            console.log(this.formattedDate);
            // Create installments
            const iAmount =
                policy.netPremium /
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
            console.log('////////////Installments Array////////////////');
            console.log(installment);

            // initialize Policy plan
            const policyPlan: PolicyPaymentPlan[] = [];
            policyPlan.push({
                ...this.paymentPlanForm.value,
                policyNumber: policy.policyNumber,
                amountDue: policy.netPremium,
                premium: policy.netPremium,
                amountPaid: 0,
                numberOfPaidInstallments: 0,
                amountOutstanding: policy.netPremium,
                policyPlanStatus: 'Unpaid',
                endDate: this.formattedDate,
                remainingInstallments: this.paymentPlanForm.controls
                    .numberOfInstallments.value,
                installments: installment,
            });

            this.clientName = policy.client;
            this.netPremium = this.netPremium + policy.netPremium;
            this.policyPlan = policyPlan;
            this.policyUpdate.paymentPlan = 'Created';
            console.log(';;;;;;;;;;Update Data;;;;;;;;;;;;');
            console.log(this.policyUpdate);
            // this.receiptService.updatePolicy(this.policyUpdate);
        }

        console.log('-----------------------');
        console.log(this.policyPlan);

        // Payment Plan
        const plan: IPaymentModel = {
            id: v4(),
            clientName: this.paymentPlanForm.controls.clientName.value,
            clientId: '',
            numberOfPolicies: 1,
            totalPremium: this.netPremium,
            status: 'UnPaid',
            policyPaymentPlan: this.policyPlan,
        };

        // add payment plan
        this.paymentPlanService.addPaymentPlan(plan);
        this.paymentPlanForm.reset();
        this.isVisible = false;
    }
}
