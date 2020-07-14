import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
    IPaymentModel,
    InstallmentsModel,
    PolicyPaymentPlan,
    PlanReceipt,
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
import { AccountService } from '../../services/account.service';
import { IReceiptModel } from '../models/receipts.model';
import { NzMessageService } from 'ng-zorro-antd';

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
    optionList: string[] = [];

    // search value for filtering payment plan table
    searchString: string;
    selectedValue: string;
    paymentPlanForm: FormGroup;
    formattedDate: any;
    clientName: any;
    netPremium = 0;
    formattedeDate: any;
    _id: string;
    user: string;
    constructor(
        private router: Router,
        private paymentPlanService: PaymentPlanService,
        private receiptService: AccountService,
        private policyService: PoliciesService,
        private readonly clientsService: ClientsService,
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private changeDetectorRefs: ChangeDetectorRef,
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
        

        this.refresh()
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

    refresh() {

        this.paymentPlanService.getPaymentPlan().subscribe((paymentPlans) => {
            this.paymentPlansList = paymentPlans.data;
            this.paymentPlansCount = paymentPlans.data.length;

            this.dispalyPaymentPlansList = this.paymentPlansList;
            // this.changeDetectorRefs.detectChanges();
            console.log("PLANS", paymentPlans.data);
            
        });
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
            '/flosure/accounts/payment-plan/' + paymentPlan.ID
        );
    }

    // add new payment plan
    async addPaymentPlan() {

        let pAmount = 0;

        let policyCount = 0;
        const policyPlan: PolicyPaymentPlan[] = [];

        for (const policy of this.policyNumber) {
            this.policyUpdate = policy;

            console.log(this.policyUpdate);

            pAmount = pAmount + policy.netPremium;
            policyCount++;

            
            this.clientName = policy.client;
            this.netPremium = this.netPremium + policy.netPremium;
            // this.policyPlan = policyPlan;
            this.policyUpdate.paymentPlan = 'Created';
            // this.accountService.updatePolicy(this.policyUpdate);
        }

        const plan: IPaymentModel = {
            client_id: 'trtrhthtrhrrtrh',
            number_of_installments: this.paymentPlanForm.controls
            .numberOfInstallments.value,
            initial_installment_amount: this.paymentPlanForm.controls.initialInstallmentAmount
            .value,
            number_of_policies: policyCount,
            total_premium: Number(pAmount),
            status: 'UnPaid',
            remaining_installments: this.paymentPlanForm.controls
                .numberOfInstallments.value - 1,
            amount_paid: this.paymentPlanForm.controls.initialInstallmentAmount
                .value,
            number_of_paid_installments: 1,
            amount_outstanding: pAmount - this.paymentPlanForm.controls.initialInstallmentAmount
            .value,
            start_date: this.paymentPlanForm.controls.startDate.value,
        };

        

        console.log("PAY PLAN", plan);
        

        await this.paymentPlanService.createPaymentPlan(plan).subscribe(async (res) => {
            console.log('RESU', res);
            // const ed =res.data
            plan.end_date = res.end_date;
            this.message.success('Payment Plan Created Successfully')
           this.dispalyPaymentPlansList = [...this.dispalyPaymentPlansList,...[res.data]]

           const receipt: IReceiptModel = {
            payment_method: '',
            received_from: this.clientName,
            on_behalf_of: this.clientName,
            captured_by: 'charles malama',
            receipt_status: 'Receipted',
            narration: 'Payment Plan',
            receipt_type: 'Premium Payment',
            sum_in_digits: Number(res.data.amount_paid),
            today_date: new Date(),
        };



        // this.receiptNum = this._id;
      await this.receiptService
            .addReceipt(
                receipt,
                'Comprehensive'
            ).then((mess) => {
                // this.policyNumber[0].receiptStatus = 'Receipted';
                // this.policyNumber[0].paymentPlan = 'Created';

                // this.policeServices.updatePolicy(this.policy).subscribe();
            })
            .catch((err) => {
                this.message.warning('Receipt Failed');
                console.log('Receipt failed>>>>',err);
            });

        }, (err) => {
            this.message.error('Receipt Failed')
        });

        this.paymentPlanForm.reset();
        this.isVisible = false;
    }

    // search payment plan table
    // search(value: string) {
    //     if (value === ' ' || !value) {
    //         this.dispalyPaymentPlansList = this.paymentPlansList;
    //     }

    //     // this.dispalyPaymentPlansList = this.paymentPlansList.filter(
    //     //     (paymentPlan) => {
    //     //         return (
    //     //             paymentPlan.clientName
    //     //                 .toLowerCase()
    //     //                 .includes(value.toLowerCase()) ||
    //     //             paymentPlan.clientId
    //     //                 .toLowerCase()
    //     //                 .includes(value.toLowerCase())
    //     //         );
    //     //     }
    //     // );
    // }

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

    
}
