import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    IPaymentModel,
    InstallmentsModel,
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
} from 'src/app/clients/models/clients.model';

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
    policyNumber = [];

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
    formattedeDate: string;
    constructor(
        private router: Router,
        private paymentPlanService: PaymentPlanService,
        private policyService: PoliciesService,
        private readonly clientsService: ClientsService,
        private formBuilder: FormBuilder
    ) {
        this.paymentPlanForm = this.formBuilder.group({
            numberOfInstallments: ['', Validators.required],
            clientName: ['', Validators.required],
            policyNumber: ['', Validators.required],
            startDate: ['', Validators.required],
            initialInstallmentAmount: ['', Validators.required],
        });

        console.log('----------this.selectedClient----------');
        console.log(this.listOfPolicies);
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
            this.policies = _.filter(
                policies,
                (x) => x.paymentPlan === 'NotCreated'
            );
            this.isLoading = false;
            console.log('-------POLICIES--------');
            console.log(this.policies);
        });

        console.log('-------Value--------');
        console.log(this.selectedValue);
    }
    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

    log(value): void {
        this.listOfPolicies = this.policies.filter((x) => x.client === value);
        console.log(value);
    }

    clientChange(value) {
        // this.listOfPolicies = this.policies.filter(
        //     (x) => x.client === this.selectedValue
        // )[0];
        // this.listOfPolicies = this.policies.filter((x) => x.client === value);
        console.log('Project One');
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
        // Get enddate
        console.log('---------GGGGGGGHHHHHHHHH---------');
        console.log(this.policyNumber);
        let pAmount = 0;
        let policyCount = 0;

        for (const policy of this.policyNumber) {
            this.policyUpdate = policy;

            pAmount = pAmount + policy.netPremium;
            policyCount++;

            // // initialize Policy plan
            // const policyPlan: PolicyPaymentPlan[] = [];
            // policyPlan.push({
            //     policyNumber: policy.policyNumber,
            //     premium: policy.netPremium,
            //     startDate: policy.startDate,
            //     endDate: policy.endDate,
            // });

            this.clientName = policy.client;
            this.netPremium = this.netPremium + policy.netPremium;
            // this.policyPlan = policyPlan;
            this.policyUpdate.paymentPlan = 'Created';
        }

        const eDate = new Date(this.paymentPlanForm.controls.startDate.value);
        eDate.setMonth(
            eDate.getMonth() +
                this.paymentPlanForm.controls.numberOfInstallments.value
        );
        this.formattedeDate = eDate.toISOString().slice(0, 10);

        const dAmount =
            pAmount -
            this.paymentPlanForm.controls.initialInstallmentAmount.value;

        // Create installments
        const iAmount =
            dAmount / this.paymentPlanForm.controls.numberOfInstallments.value;
        const installment: InstallmentsModel[] = [];

        // for (
        //     let i = 0;
        //     i < this.paymentPlanForm.controls.numberOfInstallments.value;
        //     i++
        // )
        const iDate = new Date(this.paymentPlanForm.controls.startDate.value);
        while (iDate <= eDate) {
            iDate.setMonth(iDate.getMonth() + 1);
            this.formattedDate = iDate.toISOString().slice(0, 10);

            installment.push({
                installmentAmount: iAmount,
                installmentDate: this.formattedDate,
                balance: iAmount,
                installmentStatus: 'UnPaid',
            });
        }
        // Payment Plan
        const pDate = new Date(this.paymentPlanForm.controls.startDate.value);

        const plan: IPaymentModel = {
            ...this.paymentPlanForm.value,
            id: v4(),
            clientId: '',
            numberOfPolicies: policyCount,
            totalPremium: pAmount,
            status: 'UnPaid',
            policyPaymentPlan: this.policyNumber,
            remainingInstallments: this.paymentPlanForm.controls
                .numberOfInstallments.value,
            amountPaid: 0,
            numberOfPaidInstallments: 0,
            amountOutstanding: dAmount,
            installments: installment,
            startDate: pDate,
            endDate: this.formattedeDate,
        };

        console.log('..........Payment Plan..........');
        console.log(plan);

        // add payment plan
        this.paymentPlanService.addPaymentPlan(plan);
        this.paymentPlanForm.reset();
        this.isVisible = false;
    }
}
