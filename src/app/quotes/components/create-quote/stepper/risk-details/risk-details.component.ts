import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/quotes/services/stepper.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-risk-details',
    templateUrl: './risk-details.component.html',
    styleUrls: ['./risk-details.component.scss']
})
export class RiskDetailsComponent implements OnInit {
    QuotationProductDetailsStepper() {
        this.stepperService.changeIndex(1);
        this.router.navigateByUrl(
            '/flosure/create-quote/quotation-product-details'
        );
    }

    riskDetailsForm: FormGroup;
    constructor(
        private _formBuilder: FormBuilder,
        private stepperService: StepperService,
        private readonly router: Router,
        private formBuilder: FormBuilder
    ) {
        this.riskDetailsForm = this.formBuilder.group({
            insured_type: '',
            insured: '',
            sub_class: '',
            risk_id: '',
            period_rates: '',
            negotiated_premium: '',
            binder: '',
            cover_type: '',
            risk_description: '',
            commission_rate: ''
        });
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(2);
    }
}
