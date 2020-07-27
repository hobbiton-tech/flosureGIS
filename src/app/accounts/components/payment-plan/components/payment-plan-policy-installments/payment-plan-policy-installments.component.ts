import { Component, OnInit } from '@angular/core';
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

    // payment plan policy data
    paymentPlanPolicyData: Policy = new Policy();

    // payment plan policy installment data
    paymentPlanPolicyInstallmentData: InstallmentsModel = new InstallmentsModel();


    // payment plan policies
    paymentPlanPolicies: Policy[] = [];

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
    user = '';
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

    displayPoliciesList: PlanPolicy[];
    displayReceiptsList: any[] = [];
    clientI: any;
    clientType: string;
    receiptNo: string;
    paymentPlanReceipts: PlanReceipt[];
    rptNo: string;
    rcpt: any;
    listOfPolicies: any;
    amount: any;
    allocationReceipt: any;
    planReceipt: any[] = [];
    paymentPlans: any[] = [];
    paymentPlan: any;
    policyPlan: any[] = [];

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
        this.cancelForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
        this.reinstateForm = this.formBuilder.group({
            remarks: ['', Validators.required],
        });
        this.allocationForm = this.formBuilder.group({
            policies: ['', Validators.required],
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
        });

    }

    ngOnInit(): void {
        
        this.route.params.subscribe(async (param) => {
            this.loadingReceipt = true;

            setTimeout(() => {
                this.loadingReceipt = false;
            }, 3000);
            
            
            this.paymentPlanId = param.id;
            this.policyNumber = param.policyNumber;

            this.paymentPlanService.getPaymentPlan().subscribe((res) => {
                this.paymentPlans = res.data

                this.paymentPlan = this.paymentPlans.filter((x) => x.ID === Number(this.paymentPlanId))[0];

                this.clientsService.getAllClients().subscribe(clients => {
                    this.client = [...clients[1], ...clients[0]].filter(
                        x => x.id === String(this.paymentPlan.client_id)
                    )[0];
    
                    console.log('PAYMENT PLAN<><><><><><>', this.client);
     
                });


                this.paymentPlanService.getPlanPolicy().subscribe((res) => {
                    this.policyPlan = res.data.filter((x) => x.plan_id === Number(this.paymentPlanId));
    
                    console.log('PAYMENT PLAN<><><><><><>', this.policyPlan);
                })
    
                this.paymentPlanService.getInstallments().subscribe((res) => {
                    this.paymentPlanPolicyInstallments = res.data.filter((x: InstallmentsModel) => x.payment_plan_id  === Number(param.id));
                        this.paymentPlanPolicyInstallmentsCount = res.data.filter((x) => x.payment_plan_id === Number(param.id)).length;
                });
    
                this.paymentPlanService.getReceiptPlan().subscribe((res) => {
                    this.planReceipt = res.data
                    this.displayReceiptsList = this.planReceipt.filter((x) => x.plan_id === Number(this.paymentPlanId))
                })

                
                
                
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
        // this.clientName = unreceipted.client;
        // this.policyNumber = unreceipted.policyNumber;
        this.user = 'Chalres Malama';
        // this.policy = unreceipted;
        this.receiptForm
            .get('sum_in_digits')
            .setValue(Number(paymentPlanPolicyInstallment.balance));
        this.installmentAmount = paymentPlanPolicyInstallment.installment_amount;
    }

    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    capitalize(s){
        return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
    };


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
                captured_by: this.user,
                receipt_status: this.recStatus,
                sum_in_digits: Number(amount),
                today_date: new Date(),
                invoice_number: '',
                source_of_business: '',
                intermediary_name: '',
                currency: '',
            };
    
            const plan: PlanReceipt = {
                plan_id: this.paymentPlanId,
                allocation_status: 'Unallocated',
                amount: Number(amount),
                receipt_number: 'string'
            }
    
            // this.receiptNum = this._id;
          await this.receiptService
                .addReceipt(
                    receipt, 'Comprehensive' ).subscribe((mess) => {
                        this.message.success('Receipt Successfully created');
                        planReceipt.push(plan);

                        this.paymentPlanService.addPlanReceipt(plan).toPromise();
    
    
                        if (this.displayReceiptsList === undefined) {
                            this.displayReceiptsList = [...planReceipt];
                        } else {
                            this.displayReceiptsList = [
                                ...this.displayReceiptsList,
                                ...planReceipt,
                            ];
                        }
            
                        this.receiptNum = this._id;
                        console.log(mess);
                    },
                    (err) => {
                        this.message.warning('Receipt Failed');
                        console.log(err);
                    });
                    
                //     .then((mess) => {



                //     planReceipt.push(plan);

                //     this.paymentPlanService.addPlanReceipt(plan).toPromise();


                //     if (this.displayReceiptsList === undefined) {
                //         this.displayReceiptsList = [...planReceipt];
                //     } else {
                //         this.displayReceiptsList = [
                //             ...this.displayReceiptsList,
                //             ...planReceipt,
                //         ];
                //     }
        
                //     this.receiptNum = this._id;
                //     // this.policyNumber[0].receiptStatus = 'Receipted';
                //     // this.policyNumber[0].paymentPlan = 'Created';
    
                //     // this.policeServices.updatePolicy(this.policy).subscribe();
                // })
                // .catch((err) => {
                //     this.message.warning('Receipt Failed');
                //     console.log('Receipt failed>>>>',err);
                // });

















            
            
            // this.paymentPlanData.planReceipt = this.displayReceiptsList;

            // const p = this.paymentPlanPolicyInstallments;
            // let d = amount;

            // this.paymentPlanData.amount_outstanding =
            //     this.paymentPlanData.amount_outstanding - amount;
            // this.paymentPlanData.amount_paid =
            //     this.paymentPlanData.amount_paid + amount;
            // if (this.paymentPlanData.amount_outstanding !== 0) {
            //     this.paymentPlanData.status = 'Partially Paid';
            // } else if (this.paymentPlanData.amount_outstanding >= 0) {
            //     this.paymentPlanData.status = 'Fully Paid';
            // }
            // for (let i = 0; i < p.length; i++) {
            //     console.log(d);

            //     if (d > p[i].balance && p[i].balance !== 0) {
            //         d = d - p[i].balance;
            //         p[i].balance = 0;
            //         p[i].installment_status = 'Fully Paid';
            //         p[i].actual_paid_date = this.today;
            //         count++;
            //         this.paymentPlanData.number_of_paid_installments =
            //             this.paymentPlanData.number_of_paid_installments + count;
            //         this.paymentPlanData.remaining_installments =
            //             this.paymentPlanData.remaining_installments - count;
            //         // this.isVisible = false;
            //     }
            //     if (d < p[i].balance && p[i].balance !== 0) {
            //         p[i].balance = p[i].balance - d;
            //         p[i].installment_status = 'Partially Paid';
            //         p[i].actual_paid_date = this.today;
            //         console.log(count);

            //         break;
            //     }

            //     if (d === p[i].balance && p[i].balance !== 0) {
            //         p[i].balance = p[i].balance - d;
            //         p[i].installment_status = 'Fully Paid';
            //         p[i].actual_paid_date = this.today;
            //         count++;
            //         this.paymentPlanData.number_of_paid_installments =
            //             this.paymentPlanData.number_of_paid_installments + count;
            //         this.paymentPlanData.remaining_installments =
            //             this.paymentPlanData.remaining_installments - count;
            //         console.log(count);
            //         break;
            //     }
            // }
            this.receiptForm.reset();
            setTimeout(() => {
                this.isVisible = false;
                this.isOkLoading = false;
            }, 30);

            // await this.paymentPlanService.addReceipt(
            //     receipt,
            //     this.paymentPlanData
            // );
            // this.policy.receiptStatus = 'Receipted';
            // console.log('<++++++++++++++++++CLAIN+++++++++>');
            // console.log(this.policy);
            // await this.receiptService.updatePolicy(this.policy);

            // await this.paymentPlanService.updatePaymentPlan(
            //     this.paymentPlanData
            // );
            // this.generateID(this._id);
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

    getInstallmentDate(installment: InstallmentsModel) {
        const date = installment.installment_date as ITimestamp;
        return date.seconds * 1000;
    }

    getActualDate(installment: InstallmentsModel): number {
        const date = installment.actual_paid_date as ITimestamp;
        return date.seconds * 1000;
    }

    showAllocationModal(receipt) {
        this.isAllocationVisible = true;
        this.amount = receipt.sum_in_digits;

        this.allocationReceipt = receipt;
        // this.allocationForm.get('sumInDigits').setValue(receipt.sumInDigits);
    }

    handleAllocationCancel() {
        this.isAllocationVisible = false;
    }

    handleAllocationOk() {
        console.log(this.allocationForm.controls.policies.value);

        let allocationDif = this.amount;

        // let receipt: any;
        let index = 0;
        const policies = this.allocationForm.controls.policies.value;

        for (const policy of policies) {
            if (allocationDif > policy.netPremium) {
                allocationDif = allocationDif - policy.netPremium;
                this.allocationReceipt.sum_in_digits = allocationDif;
                index = this.displayReceiptsList.findIndex(
                    (e) =>
                        e.receipt_number === this.allocationReceipt.receiptNumber
                );
                this.displayReceiptsList[index].amount = allocationDif;
                this.displayReceiptsList[index].allocation_status =
                    'Partially Allocated';
                policy.allocatedAmount = policy.netPremium;
                policy.allocationStatus = 'Allocated';
                continue;
            }
            if (allocationDif < policy.netPremium) {
                allocationDif = policy.netPremium - allocationDif;
                index = this.displayReceiptsList.findIndex(
                    (e) =>
                        e.receipt_number === this.allocationReceipt.receiptNumber
                );
                this.displayReceiptsList[index].amount = 0;

                this.displayReceiptsList[index].allocation_status = 'Allocated';

                policy.allocatedAmount = policy.allocatedAmount + this.amount;
                policy.allocationStatus = 'Partially Allocated';
                console.log(this.displayReceiptsList);
                break;
            }
            if (allocationDif === policy.netPremium) {
                allocationDif = policy.netPremium - allocationDif;
                index = this.displayReceiptsList.findIndex(
                    (e) =>
                        e.receipt_number === this.allocationReceipt.receiptNumber
                );
                this.displayReceiptsList[index].amount = 0;

                this.displayReceiptsList[index].allocation_status = 'Allocated';

                policy.allocatedAmount = this.amount;
                policy.allocationStatus = 'Allocated';
                console.log(this.displayReceiptsList);
                break;
            }
        }

        this.listOfPolicies = policies;

        // this.paymentPlanData.policyPaymentPlan = this.listOfPolicies;
        // this.paymentPlanService.updatePaymentPlan(this.paymentPlanData);
        this.isAllocationVisible = false;
    }

    showPolicyModal() {
        this.isPolicyVisible = true;
    }
}
