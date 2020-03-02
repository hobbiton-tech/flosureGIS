import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/quotes/services/stepper.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotation-product-details',
  templateUrl: './quotation-product-details.component.html',
  styleUrls: ['./quotation-product-details.component.scss']
})
export class QuotationProductDetailsComponent implements OnInit {

  quotationDetailsStepper() {
    this.stepperService.changeIndex(0);
    this.router.navigateByUrl('create-quote/quotation-details')
  }

  RiskDetailsStepper() {
    this.stepperService.changeIndex(3);
    this.router.navigateByUrl('create-quote/risk-details')
  }

  quotationProductDetailsForm: FormGroup;
  constructor( 
    private _formBuilder: FormBuilder,
    private stepperService: StepperService,
    private readonly router: Router,
    private formBuilder: FormBuilder
  ) { 
    this.quotationProductDetailsForm = this.formBuilder.group({
      binder_type: '',
      binder: ''
    })
    
  }

  ngOnInit(): void {
    this.stepperService.toggleStepper(true);
    this.stepperService.changeIndex(2)
  }

}
