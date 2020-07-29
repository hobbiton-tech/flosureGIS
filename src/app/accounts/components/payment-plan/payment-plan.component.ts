import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
    IPaymentModel,
    InstallmentsModel,
    PlanPolicy,
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
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-payment-plan',
    templateUrl: './payment-plan.component.html',
    styleUrls: ['./payment-plan.component.scss'],
})
export class PaymentPlanComponent implements OnInit {
    paymentPlansList: IPaymentModel[];
    dispalyPaymentPlansList: IPaymentModel[] = [];

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
    clientId: any;
    planID: any;
    receiptID: any;
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
        private http: HttpClient,
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
        
        this.user = localStorage.getItem('user');

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
        let policyPlan: PlanPolicy;
        // policyPlan = {
        //     start_date: policy.startDate,
        //     end_date: policy.endDate,
        //     net_premium: policy.netPremium,
        //     allocation_status: 'Unallocated',
        //     policy_number: policy.policyNumber,
        //     allocation_amount: 0,
        //     plan_id: res.data.ID
        // }

        for (const policy of this.policyNumber) {
            this.policyUpdate = policy;

            


            console.log(this.policyUpdate);

            pAmount = pAmount + policy.netPremium;
            policyCount++;

            
            this.clientName = policy.client;
            this.clientId = policy.clientCode
            this.netPremium = this.netPremium + policy.netPremium;
            // this.policyPlan = policyPlan;
            this.policyUpdate.paymentPlan = 'Created';
            // this.accountService.updatePolicy(this.policyUpdate);
        }

        const plan: IPaymentModel = {
            client_id: this.clientId,
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
        

        this.paymentPlanService.createPaymentPlan(plan).subscribe(async (res) => {
            console.log('RESU', res);
            // const ed =res.data
            plan.end_date = res.end_date;
            this.message.success('Payment Plan Created Successfully');
            this.dispalyPaymentPlansList = [...this.dispalyPaymentPlansList, ...[res.data]];

            const receipt: IReceiptModel = {
                payment_method: '',
                received_from: this.clientName,
                on_behalf_of: this.clientName,
                captured_by: this.user,
                receipt_status: 'Receipted',
                narration: 'Payment Plan',
                receipt_type: 'Premium Payment',
                sum_in_digits: Number(res.data.amount_paid),
                today_date: new Date(),
            };

            this.planID = res.data.ID


            const planPaymentReceipt: PlanReceipt = {
                plan_id: res.data.ID,
                allocation_status: 'Unallocated',
                amount: Number(res.data.amount_paid),
            };


            this.http
                .get<any>(
                    `https://number-generation.flosure-api.com/savenda-receipt-number/1`
                )
                .subscribe(async (res) => {
                    receipt.receipt_number = res.data.receipt_number;
                    console.log(res.data.receipt_number);

                    this.http.post('https://payment-api.savenda-flosure.com/receipt', receipt).subscribe((res: any) => {
                        this.message.success('Receipt Successfully created');
                        console.log('RECEIPT NUMBER<><><><>', res);

                        planPaymentReceipt.receipt_number = res.data.receipt_number;
                        this.paymentPlanService.addPlanReceipt(planPaymentReceipt).toPromise();

                        this.receiptID = res.data.ID
                        
                    },
                        err => {
                            this.message.warning('Receipt Failed');
                            console.log(err);
                        });
                });
        }, (err) => {
            this.message.error('Receipt Failed');
        });

        for (const policy of this.policyNumber) {
            console.log('NEW MWMWMWMW>>>>', policy);
            policyPlan = {
                start_date: policy.startDate,
                end_date: policy.endDate,
                net_premium: Number(policy.netPremium),
                allocation_status: 'Unallocated',
                policy_number: policy.policyNumber,
                allocation_amount: 0,
                plan_id: Number(this.planID)
            }


            this.paymentPlanService.addPlanPolicy(policyPlan).subscribe((mess) =>{
                console.log('WUWUWUW><><><><><', this.receiptID);
            }, (err) => {
                this.message.warning('Plan Policy Failed');
                console.log(err);
            });
            
        }

        // this.generateID(this.receiptID);
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

    generateID(id) {
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + id);
    }

    
}
