import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPaymentModel } from '../models/payment-plans.model';
import { PaymentPlanService } from '../../services/payment-plan.service';


@Component({
    selector: 'app-payment-plan',
    templateUrl: './payment-plan.component.html',
    styleUrls: ['./payment-plan.component.scss'],
})
export class PaymentPlanComponent implements OnInit {
  paymentPlansList: IPaymentModel[];
  dispalyPaymentPlansList: IPaymentModel[];

  //number of payment plans
  paymentPlansCount = 0;

    //search value for filtering payment plan table
    searchString: string;

  constructor(
    private router: Router,
    private paymentPlanService: PaymentPlanService
    ) { }

  ngOnInit(): void {
    this.paymentPlanService.getPaymentPlans().subscribe((paymentPlans) => {
      this.paymentPlansList = paymentPlans;
      this.paymentPlansCount = paymentPlans.length;

      this.dispalyPaymentPlansList = this.paymentPlansList;
    })
  }

  //view policies of payment plan
  viewPaymentPlanDetails(paymentPlan: IPaymentModel) {
     this.router.navigateByUrl('/flosure/accounts/payment-plan/' + paymentPlan.id);
  }

  //add new payment plan
  addPaymentPlan() {}

  //search payment plan table
  search(value: string) {
    if (value === ' ' || !value) {
      this.dispalyPaymentPlansList = this.paymentPlansList;
    }

    this.dispalyPaymentPlansList = this.paymentPlansList.filter(paymentPlan => {
      return(
        paymentPlan.clientName.toLowerCase().includes(value.toLowerCase())
        || paymentPlan.clientId.toLowerCase().includes(value.toLowerCase())
      )
    })
  }
}
