import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    PolicyPaymentPlan,
    IPaymentModel
} from '../../../models/payment-plans.model';
import { PaymentPlanService } from 'src/app/accounts/services/payment-plan.service';

@Component({
    selector: 'app-payment-plan-policies',
    templateUrl: './payment-plan-policies.component.html',
    styleUrls: ['./payment-plan-policies.component.scss']
})
export class PaymentPlanPoliciesComponent implements OnInit {
    // payment plan Id
    paymentPlanId: string;

    // payment plan
    paymentPlan: string;

    // payment plan data
    paymentPlanData: IPaymentModel = new IPaymentModel();

    // payment plan policies
    paymentPlanPolicies: PolicyPaymentPlan[] = [];

    // number of ppolicies under payment plan
    paymentPlanPoliciesCount = 0;
    loadingReceipt = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private paymentPlanService: PaymentPlanService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(param => {
            this.paymentPlanId = param.id;
            this.loadingReceipt = true;

            setTimeout(() => {
                this.loadingReceipt = false;
            }, 3000);

            this.paymentPlanService
                .getPaymentPlans()
                .subscribe(paymentPlans => {
                    this.paymentPlanData = paymentPlans.filter(
                        x => x.id === this.paymentPlanId
                    )[0];
                    this.paymentPlanPoliciesCount = this.paymentPlanData.policyPaymentPlan.length;

                    this.paymentPlanPolicies = this.paymentPlanData.policyPaymentPlan;
                    console.log(this.paymentPlanPolicies);
                });
        });
    }

    // view policy
    viewPaymentPlanPolicyInstallments(paymentPlanPolicy: PolicyPaymentPlan) {
        this.router.navigateByUrl(
            '/flosure/accounts/payment-plan/' +
                this.paymentPlanId +
                '/' +
                paymentPlanPolicy.policyNumber
        );
    }
}
