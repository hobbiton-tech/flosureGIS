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
import { UserModel } from '../../../users/models/users.model';
import * as jwt_decode from 'jwt-decode';
import { UsersService } from '../../../users/services/users.service';
import { TransactionModel } from '../../../clients/models/client.model';

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
    policyNumber: Policy;

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
    user: UserModel;
    clientId: any;
    planID: any;
    receiptID: any;
  receiptNumber = '';
  loggedIn = localStorage.getItem('currentUser');

  clientDet: IIndividualClient & ICorporateClient;
  clientList: Array<IIndividualClient & ICorporateClient>;
  transactionList: any[] = [];
  transactionL: any;

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
        private usersService: UsersService
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

      const decodedJwtData = jwt_decode(this.loggedIn);

      this.usersService.getUsers().subscribe((users) => {
        this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];
      });


      this.refresh();
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
        });

      this.clientsService.getTransactions().subscribe((txns: any) => {
        this.transactionList = txns.data;

        console.log('TANS AXN', this.transactionL);
      });
    }

    refresh() {

        this.paymentPlanService.getPaymentPlan().subscribe((paymentPlans) => {
            this.paymentPlansList = paymentPlans.data;
            this.paymentPlansCount = paymentPlans.data.length;

            this.dispalyPaymentPlansList = this.paymentPlansList;
            console.log('PLANS', paymentPlans.data);

        });
      }





    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2

    log(value): void {
        this.listOfPolicies = this.policies.filter((x) => x.client === value);
        console.log('WHATS HAPPENINGNNNNNN>>>>>', value);
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
        this.policyUpdate = { ...this.paymentPlanForm.controls.policyNumber.value};




        console.log('wawwawawa', this.paymentPlanForm.controls.policyNumber.value);

        pAmount = pAmount + Number(this.paymentPlanForm.controls.policyNumber.value.netPremium);
        policyCount++;


        this.clientName = this.paymentPlanForm.controls.policyNumber.value.client;
        this.clientId = this.paymentPlanForm.controls.policyNumber.value.clientCode;
        this.netPremium = this.netPremium + this.paymentPlanForm.controls.policyNumber.value.netPremium;
            // this.policyPlan = policyPlan;
        this.policyUpdate.paymentPlan = 'Created';
        this.policyService.updatePolicy(this.policyUpdate).subscribe((res) => {
              console.log('Updated Policy', res);
            }, (err) => {
              console.log('Update Policy error', err); });
        // }

        this.transactionL = this.transactionList.filter((x) => x.client_id === this.clientId &&
          x.type === 'Open Cash').slice(-1)[0];

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


        const policyPlan: PlanPolicy = {
            start_date: this.paymentPlanForm.controls.policyNumber.value.startDate,
            end_date: this.paymentPlanForm.controls.policyNumber.value.endDate,
            net_premium: Number(this.paymentPlanForm.controls.policyNumber.value.netPremium),
            allocation_status: 'Unallocated',
            policy_number: this.paymentPlanForm.controls.policyNumber.value.policyNumber,
            allocation_amount: 0,
            balance: Number(this.paymentPlanForm.controls.policyNumber.value.netPremium)
        };




        console.log('PAY PLAN', plan);


        this.paymentPlanService.createPaymentPlan(plan).subscribe(async (res) => {
            console.log('RESU', res);
            // const ed =res.data
            plan.end_date = res.end_date;
            this.message.success('Payment Plan Created Successfully');
            this.dispalyPaymentPlansList = [...this.dispalyPaymentPlansList, ...[res.data]];
            this.paymentPlansCount = this.dispalyPaymentPlansList.length;

            const receipt: IReceiptModel = {
                payment_method: '',
                received_from: this.clientName,
                on_behalf_of: this.clientName,
                captured_by: this.user.ID,
                receipt_status: 'Receipted',
                narration: 'Payment Plan',
                receipt_type: 'Premium Payment',
                sum_in_digits: Number(res.data.amount_paid),
                today_date: new Date(),
              source_of_business: 'Plan-Receipt',
              currency: '',
            };

            let balanceTxn = 0;

            if (this.transactionL === null || this.transactionL === undefined || this.transactionL === 0) {
              balanceTxn = Number(res.data.amount_paid);
            } else {
              balanceTxn = Number(this.transactionL.open_balance) + Number(res.data.amount_paid);
            }


            this.planID = Number(res.data.ID);


            const planPaymentReceipt: PlanReceipt = {
                plan_id: res.data.ID,
                allocation_status: 'Unallocated',
                amount: Number(res.data.amount_paid),
            };


            this.http
                .get<any>(
                    `https://number-generation.flosure-api.com/golden-lotus-receipt-number`
                )
                .subscribe(async (resNum) => {
                    receipt.receipt_number = resNum.data.receipt_number;
                    this.receiptNumber = resNum.data.receipt_number;
                    console.log(resNum.data.receipt_number);

                    this.http.post('https://pay-api.goldenlotusinsurance.com/receipt', receipt).subscribe((resRec: any) => {
                        this.message.success('Receipt Successfully created');
                        console.log('RECEIPT NUMBER<><><><>', resRec);

                        planPaymentReceipt.receipt_number = this.receiptNumber;
                        this.paymentPlanService.addPlanReceipt(planPaymentReceipt).toPromise();

                        const transaction: TransactionModel = {
                          balance: 0,
                          cr: 0,
                          dr: 0,
                          open_cash: Number(balanceTxn),
                          reference: '',
                          transaction_amount: 0,
                          transaction_date: new Date(),
                          type: 'Open Cash',
                          receipt_id: resRec.data.ID,
                          client_id: this.clientId
                        };

                        this.clientsService.createTransaction(transaction).subscribe((sucTxn) => {}, (errTxn) => {
                          console.log(errTxn);
                        });

                        this.receiptID = resRec.data.ID;

                    },
                        err => {
                            this.message.warning('Receipt Failed');
                            console.log(err);
                        });
                });




            policyPlan.plan_id = this.planID;
            this.paymentPlanService.addPlanPolicy(policyPlan).subscribe((mess) => {
                        console.log('WUWUWUW><><><><><', this.receiptID);
                    }, (err) => {
                        this.message.warning('Plan Policy Failed');
                        console.log(err);
                    });

        }, (err) => {
            this.message.error('Receipt Failed');
        });
        this.paymentPlanForm.reset();
        this.isVisible = false;
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

    generateID(id) {
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + id);
    }

    clientNameMethod(value) {
      console.log('PLAN VALUE<><><><><>', value, this.clientList);
      this.clientDet = this.clients.find((el) => el.id === String(value));
      return this.clientDet;
    }


}
