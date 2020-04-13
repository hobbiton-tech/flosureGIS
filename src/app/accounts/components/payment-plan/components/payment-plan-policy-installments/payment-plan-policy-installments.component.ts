import { Component, OnInit } from '@angular/core';
import { InstallmentsModel, IPaymentModel, PolicyPaymentPlan } from '../../../models/payment-plans.model';
import { ActivatedRoute } from '@angular/router';
import { PaymentPlanService } from 'src/app/accounts/services/payment-plan.service';

@Component({
  selector: 'app-payment-plan-policy-installments',
  templateUrl: './payment-plan-policy-installments.component.html',
  styleUrls: ['./payment-plan-policy-installments.component.scss']
})
export class PaymentPlanPolicyInstallmentsComponent implements OnInit {
  installmentsList: InstallmentsModel[];
  displayInstallmentsList: InstallmentsModel[];

  //payment plan Id
  paymentPlanId: string;

  //policy number
  policyNumber: string;

  //payment plan data 
  paymentPlanData: IPaymentModel = new IPaymentModel();

  //payment plan policy data
  paymentPlanPolicyData: PolicyPaymentPlan = new PolicyPaymentPlan();

  //payment plan policy installment data
  paymentPlanPolicyInstallmentData: InstallmentsModel = new InstallmentsModel();

  //payment plan policies
  paymentPlanPolicies: PolicyPaymentPlan[] = []

  //payment plan policy installments
  paymentPlanPolicyInstallments: InstallmentsModel[] = []

  //search value for filtering installment table
  searchString: string;
  
  constructor(
    private route: ActivatedRoute,
    private paymentPlanService: PaymentPlanService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.paymentPlanId = param.id;
      this.policyNumber = param.policyNumber;

      this.paymentPlanService.getPaymentPlans().subscribe((paymentPlans) => {
        this.paymentPlanData = paymentPlans.filter((x) => x.id === this.paymentPlanId)[0];

        this.paymentPlanPolicies = this.paymentPlanData.policyPaymentPlan;

        this.paymentPlanPolicyData = this.paymentPlanPolicies.filter((x) => x.policyNumber === this.policyNumber)[0];
        this.paymentPlanPolicyInstallments = this.paymentPlanPolicyData.installments;
      })
    })
  }

  receiptInstallment() {
    
  }

  

}
