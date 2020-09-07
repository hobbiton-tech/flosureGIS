import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    InstallmentsModel,
    IPaymentModel,
    PlanPolicy,
    PlanReceipt,
} from '../../../models/payment-plans.model';

import { ActivatedRoute, Router } from '@angular/router';

import { PaymentPlanService } from 'src/app/accounts/services/payment-plan.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/accounts/services/account.service';
import { NzMessageService } from 'ng-zorro-antd';
import { IReceiptModel } from '../../../models/receipts.model';
import { v4 } from 'uuid';
import { Policy, ITimestamp } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    IIndividualClient,
    ICorporateClient,
} from 'src/app/clients/models/clients.model';
import * as _ from 'lodash';
import { IClientCorporate } from 'src/app/clients/models/client.model';
import { HttpClient } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { UsersService } from '../../../../../users/services/users.service';
import { UserModel } from '../../../../../users/models/users.model';

@Component({
    selector: 'app-payment-plan-policy-installments',
    templateUrl: './payment-plan-policy-installments.component.html',
    styleUrls: ['./payment-plan-policy-installments.component.scss'],
})
export class PaymentPlanPolicyInstallmentsComponent implements OnInit {
    receiptForm: FormGroup;
    allocationForm: FormGroup;
    cancelForm: FormGroup;
    reinstateForm: FormGroup;
    policyForm: FormGroup;
    submitted = false;
    today = new Date();
    isPolicyVisible = false;

    //
    clientName = '';
    recStatus = 'Receipted';
    installmentAmount = 0;
    receiptNum = '';
    policy: Policy = new Policy();

    installmentsList: InstallmentsModel[];
    displayInstallmentsList: InstallmentsModel[];

    // payment plan Id
    paymentPlanId: number;

    // policy number
    policyNumber: string;


    // payment plan policy installments
    paymentPlanPolicyInstallments: InstallmentsModel[] = [];

    // search value for filtering installment table
    searchString: string;

    // payment plan policy installments
    paymentPlanPolicyInstallmentsCount = 0;

    // Recipting
    isVisible = false;
    isAllocationVisible = false;
    isCancelVisible = false;
    isReinstateVisible = false;
    isOkLoading = false;
    // policyNumber = '';
    user: UserModel;
    _id = '';
    loadingReceipt = false;
    client: any;
    selectedPolicies = [];

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

  currencyList = [
    { label: 'ZMW', value: 'ZMW' },
    { label: 'USD', value: 'USD' },
  ];

    displayPoliciesList: PlanPolicy[];
    displayReceiptsList: any[] = [];
    clientI: any;
    clientType: string;
    receiptNo: string;
    paymentPlanReceipts: PlanReceipt[];
    rptNo: string;
    rcpt: any;
    listOfPolicies: any[] = [];
    amount: any;
    allocationReceipt: any;
    planReceipt: any[] = [];
    paymentPlans: any[] = [];
    paymentPlan: any;
    policyPlan: any[] = [];
    policies: any[] = [];
    minInstallments: number;
    selectedRole: any;
    selectedAllocationPolicy: any;
  loggedIn = localStorage.getItem('currentUser');

    constructor(
        private route: ActivatedRoute,
        private paymentPlanService: PaymentPlanService,
        private receiptService: AccountService,
        private policyService: PoliciesService,
        private formBuilder: FormBuilder,
        private message: NzMessageService,
        private router: Router,
        private clientsService: ClientsService,
        private http: HttpClient, private changeDetectorRefs: ChangeDetectorRef,
        private usersService: UsersService
    ) {
        this.cancelForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
        this.reinstateForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
        this.allocationForm = this.formBuilder.group({
            policy: ['', Validators.required],
            amount: ['', Validators.required],
        });

        this.receiptForm = this.formBuilder.group({
            received_from: ['', Validators.required],
            sum_in_digits: [''],
            payment_method: ['', Validators.required],
            receipt_type: ['', Validators.required],
            narration: ['', Validators.required],
            date_received: [''],
            today_date: [''],
            remarks: [''],
            cheq_number: [''],
            currency: ['', Validators.required]
        });

        this.policyForm = this.formBuilder.group({
            policy: ['', Validators.required],
            number_of_installments: ['', Validators.required]
        });

    }

    ngOnInit(): void {
      this.refresh();

    }

    refresh() {
      this.route.params.subscribe(async (param) => {
        this.loadingReceipt = true;

        setTimeout(() => {
          this.loadingReceipt = false;
        }, 3000);

        const decodedJwtData = jwt_decode(this.loggedIn);

        this.usersService.getUsers().subscribe((users) => {
          this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];
        });


        this.paymentPlanId = param.id;
        this.policyNumber = param.policyNumber;

        this.paymentPlanService.getPaymentPlan().subscribe((res) => {
          this.paymentPlans = res.data;

          this.paymentPlan = this.paymentPlans.filter((x) => x.ID === Number(this.paymentPlanId))[0];

          this.minInstallments = this.paymentPlan.number_of_installments;

          this.policyForm
            .get('number_of_installments')
            .setValue(this.minInstallments);

          this.clientsService.getAllClients().subscribe(clients => {
            this.client = [...clients[1], ...clients[0]].filter(
              x => x.id === String(this.paymentPlan.client_id)
            )[0];

            // console.log('PAYMENT PLAN<><><><><><>', this.client);

          });


          this.paymentPlanService.getPlanPolicy().subscribe((resGet) => {
            this.policyPlan = resGet.data.filter((x) => x.plan_id === Number(this.paymentPlanId));
            // this.policyPlan = res.data;
            this.policyPlan = [...this.policyPlan];

            // this.listOfPolicies = this.policyPlan

            console.log('PAYMENT PLAN<><><><><><>', this.policyPlan);
          });

          this.paymentPlanService.getInstallments().subscribe((resPay) => {
            this.paymentPlanPolicyInstallments = resPay.data.filter((x: InstallmentsModel) => x.payment_plan_id  === Number(param.id));
            this.paymentPlanPolicyInstallmentsCount = resPay.data.filter((x) => x.payment_plan_id === Number(param.id)).length;
            this.changeDetectorRefs.detectChanges();
          });

          this.paymentPlanService.getReceiptPlan().subscribe((resRecpt) => {
            this.planReceipt = resRecpt.data;
            this.displayReceiptsList = this.planReceipt.filter((x) => x.plan_id === Number(this.paymentPlanId));
          });


          this.policyService.getPolicies().subscribe((policies) => {
            this.policies = _.filter(
              policies,
              (x) => x.paymentPlan === 'NotCreated'
            );
            console.log('-------POLICIES--------', this.policies);
          });

        });



      });
    }


    // viewPolicyDetails(policy): void {
    //     // this.router.navigateByUrl(
    //     //     '/flosure/underwriting/policy-details/' + policy.policyNumber
    //     // );
    // }

    showModal(paymentPlanPolicyInstallment: InstallmentsModel): void {
        this.isVisible = true;

        this.receiptForm
            .get('sum_in_digits')
            .setValue(Number(paymentPlanPolicyInstallment.balance));
        this.installmentAmount = paymentPlanPolicyInstallment.installment_amount;
    }

    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    capitalize(s) {
      if (s !== null || true) {
        return s.toLowerCase().replace( /\b./g, (a) => a.toUpperCase() );
      } else {}
      return null;
    }


    receiptInstallment() {}

    // modal cancel
    handleCancel(): void {
        this.isVisible = false;
    }

    async handleOk() {
        this.submitted = true;
        console.log('.........RPT No...........');
        console.log(this.rptNo);

        if (this.receiptForm.valid) {
            const amount = this.receiptForm.controls.sum_in_digits.value;
            let count = 0;
            this.isOkLoading = true;
            this._id = v4();


            const planReceipt: PlanReceipt[] = [];



            const receipt: IReceiptModel = {
                received_from: this.receiptForm.controls.received_from.value,
                payment_method: this.receiptForm.controls.payment_method.value,
                receipt_type: this.receiptForm.controls.receipt_type.value,
                narration: this.receiptForm.controls.narration.value,
                date_received: new Date(),
                remarks: this.receiptForm.controls.remarks.value,
                cheq_number: this.receiptForm.controls.cheq_number.value,
                on_behalf_of: this.clientName,
                captured_by: this.user.ID,
                receipt_status: this.recStatus,
                sum_in_digits: Number(amount),
                today_date: new Date(),
                invoice_number: '',
                source_of_business: 'Plan-Receipt',
                intermediary_name: '',
                currency: this.receiptForm.controls.currency.value,
            };

            const plan: PlanReceipt = {
                plan_id: Number(this.paymentPlanId),
                allocation_status: 'Unallocated',
                amount: Number(amount),
                receipt_number: 'string'
            };



            this.http
                .get<any>(
                    `https://number-generation.flosure-api.com/savenda-receipt-number/1`
                )
                .subscribe(async (res) => {
                    receipt.receipt_number = res.data.receipt_number;
                    console.log(res.data.receipt_number);

                    this.http.post('https://payment-api.savenda-flosure.com/receipt', receipt).subscribe((resRCPT: any) => {
                        this.message.success('Receipt Successfully created');


                        plan.receipt_number = resRCPT.data.receipt_number;
                        console.log('RECEIPT NUMBER<><><><>', plan);

                        this.paymentPlanService.addPlanReceipt(plan).subscribe((resPlan) => {
                            console.log('Change TRUE', res);
                            planReceipt.push(res.data);

                            if (this.displayReceiptsList === undefined) {
                                        this.displayReceiptsList = [...planReceipt];
                                    } else {
                                        this.displayReceiptsList = [
                                            ...this.displayReceiptsList,
                                            ...planReceipt,
                                        ];
                                    }

                        },
                        (err) => {
                            console.log('Change QQ', err);
                        });

                    },
                        err => {
                            this.message.warning('Receipt Failed');
                            console.log(err);
                        });
                });




            const p: InstallmentsModel[] = [...this.paymentPlanPolicyInstallments];
            let d = amount;

            this.paymentPlan.amount_outstanding =
                this.paymentPlan.amount_outstanding - amount;
            this.paymentPlan.amount_paid =
                this.paymentPlan.amount_paid + amount;
            if (this.paymentPlan.amount_outstanding !== 0) {
                this.paymentPlan.status = 'Partially Paid';
            } else if (this.paymentPlan.amount_outstanding >= 0) {
                this.paymentPlan.status = 'Fully Paid';
            }
            for (let i = 0; i < p.length; i++) {
                console.log(d);

                if (d > p[i].balance && p[i].balance !== 0) {
                    d = d - p[i].balance;
                    p[i].balance = 0;
                    p[i].amount_paid = p[i].installment_amount;
                    p[i].installment_status = 'Fully Paid';
                    p[i].actual_paid_date = this.today;
                    count++;
                    this.paymentPlan.number_of_paid_installments =
                    Number(this.paymentPlan.number_of_paid_installments + count);
                    this.paymentPlan.remaining_installments =
                    Number(this.paymentPlan.remaining_installments - count);
                    // this.isVisible = false;
                }
                if (d < p[i].balance && p[i].balance !== 0) {
                    p[i].balance = Number( p[i].balance - d);
                    p[i].amount_paid = d;
                    p[i].installment_status = 'Partially Paid';
                    p[i].actual_paid_date = this.today;
                    console.log(count);

                    break;
                }

                if (d === p[i].balance && p[i].balance !== 0) {
                    p[i].balance = Number(p[i].balance - d);
                    p[i].amount_paid = p[i].installment_amount;
                    p[i].installment_status = 'Fully Paid';
                    p[i].actual_paid_date = this.today;
                    count++;
                    this.paymentPlan.number_of_paid_installments = Number(
                        this.paymentPlan.number_of_paid_installments + count);
                    this.paymentPlan.remaining_installments = Number(
                        this.paymentPlan.remaining_installments - count);
                    console.log(count);
                    break;
                }



            }

            console.log('installments new new>>>', p);
            this.paymentPlanService.updatePlanInstallment(p);

            this.receiptForm.reset();
            setTimeout(() => {
                this.isVisible = false;
                this.isOkLoading = false;
            }, 30);


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



    showAllocationRole(receipt) {


        if (receipt.allocation_status !== 'Allocated') {
          this.amount = receipt.amount;
          this.selectedRole = receipt;
          this.allocationReceipt = receipt;
        } else {
          this.message.warning('Receipt Already Allocated!');
        }


    }
    showAllocationModal(policy) {
        this.isAllocationVisible = true;
        console.log('ALLOCATION POLICY>>>>', policy);

        this.selectedAllocationPolicy = policy;

        this.allocationForm
                        .get('policy')
                        .setValue(policy.policy_number);
        this.allocationForm
            .get('amount')
            .setValue(this.amount);

        // this.allocationForm.get('sumInDigits').setValue(receipt.sumInDigits);
    }

    handleAllocationCancel() {
        this.isAllocationVisible = false;
    }


    handleAllocationOk() {


        let policy_allocation_status = 'Unallocated';
        let receipt_allocation_status = 'Unallocated';

        console.log('TBA>>>>>>', this.selectedRole);


        const diffPolicy = this.selectedAllocationPolicy.balance - this.allocationForm.controls.amount.value;

        const diffReceipt = this.selectedRole.amount - this.allocationForm.controls.amount.value;

        if (diffPolicy === 0) {
            policy_allocation_status = 'Allocated';
        } else if (diffPolicy > 0) {
            policy_allocation_status = 'Partially Allocated';
        }


        this.selectedAllocationPolicy.start_date = this.selectedAllocationPolicy.start_date,
        this.selectedAllocationPolicy.end_date = this.selectedAllocationPolicy.end_date,
        this.selectedAllocationPolicy.net_premium = Number(this.selectedAllocationPolicy.net_premium),
        this.selectedAllocationPolicy.allocation_status = policy_allocation_status,
        this.selectedAllocationPolicy.policy_number = this.selectedAllocationPolicy.policy_number,
        this.selectedAllocationPolicy.allocation_amount = Number(this.selectedAllocationPolicy.allocation_amount + this.allocationForm.controls.amount.value),
        this.selectedAllocationPolicy.balance = Number(diffPolicy);


        if (diffReceipt === 0) {
            receipt_allocation_status = 'Allocated';
        } else if (diffReceipt > 0) {
            receipt_allocation_status = 'Partially Allocated';
        }


        this.selectedRole.plan_id = Number(this.paymentPlanId),
        this.selectedRole.allocation_status = receipt_allocation_status,
        this.selectedRole.amount = Number(diffReceipt),
        this.selectedRole.receipt_number = this.selectedRole.receipt_number;




        console.log('PLANS AND POLICIES', this.selectedAllocationPolicy , this.selectedRole);




        this.paymentPlanService.updatePlanPolicy(this.selectedAllocationPolicy );
        this.paymentPlanService.updatePlanReceipt(this.selectedRole);


        // this.displayReceiptsList = [this.selectedRole]

        // this.policyPlan = [this.selectedAllocationPolicy]


        this.isAllocationVisible = false;
    }

    showPolicyModal() {
        this.isPolicyVisible = true;
    }


    handlePolicyCancel() {
        this.isPolicyVisible = false;
    }


    handleAddPolicyOk() {
      // this.paymentPlan.number_of_installments
      this.isPolicyVisible = false;
      this.paymentPlan.number_of_policies = Number(this.paymentPlan.number_of_policies + 1);
      this.paymentPlan.total_premium = Number(this.paymentPlan.total_premium ) + Number( this.policyForm.controls.policy.value.netPremium);
      this.paymentPlan.amount_outstanding = Number(this.paymentPlan.amount_outstanding ) + Number( this.policyForm.controls.policy.value.netPremium);
      this.paymentPlan.number_of_installments = Number(this.paymentPlan.number_of_installments ) + Number( this.policyForm.controls.number_of_installments.value);
      this.paymentPlan.remaining_installments = Number(this.paymentPlan.remaining_installments ) + Number( this.policyForm.controls.number_of_installments.value);

      const policyUpdate = this.policyForm.value;
      policyUpdate.paymentPlan = 'Created';

      console.log('Updated POLICY????????????????', policyUpdate);

      const policyPlan: PlanPolicy = {
        start_date: this.policyForm.controls.policy.value.startDate,
        end_date: this.policyForm.controls.policy.value.endDate,
        net_premium: Number(this.policyForm.controls.policy.value.netPremium),
        allocation_status: 'Unallocated',
        policy_number: this.policyForm.controls.policy.value.policyNumber,
        allocation_amount: 0,
        balance: Number(this.policyForm.controls.policy.value.netPremium)
      };

      this.paymentPlanService.updatePaymentPlan(this.paymentPlan).subscribe((res) => {
          this.message.success(
            'Payment Plan Successfully Updated'
          );
          this.paymentPlanService.getInstallments().subscribe((mess) => {
            const inst: any[] = mess.data.filter((x: InstallmentsModel) => x.payment_plan_id  === Number(this.paymentPlanId));
            this.paymentPlanPolicyInstallments = [...inst];
            this.paymentPlanPolicyInstallmentsCount = this.paymentPlanPolicyInstallments.length;
          });


          policyPlan.plan_id = Number(this.paymentPlanId);
          this.paymentPlanService.addPlanPolicy(policyPlan).subscribe((mess) => {
            console.log('WUWUWUW><><><><><', mess);
            this.policyPlan = [...this.policyPlan, ...[policyPlan]];
            this.policyService.updatePolicy(policyUpdate).subscribe((res) => {}, (err) => {
              console.log('Update Policy error', err); });
          }, (err) => {
            this.message.warning('Plan Policy Failed');
            console.log(err);
          });
        },
        (err) => {
          console.log('Check ERR>>>>', err);

          this.message.warning('Payment Plan Update Failed');
        });

    }
  // console.log("NEW ISTALLMENTS>>>>>>>", res.data);


}
