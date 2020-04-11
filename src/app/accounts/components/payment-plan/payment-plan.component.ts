import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.scss']
})
export class PaymentPlanComponent implements OnInit {

  //search value for filtering payment plan table
  searchString: string;

  constructor() { }

  ngOnInit(): void {
  }

  //view details of payment plan
  viewPaymentPlanDetails() {}

  //search payment plan table
  search($event) {}

}
