import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/quotes/services/stepper.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-quotation-details',
    templateUrl: './quotation-details.component.html',
    styleUrls: ['./quotation-details.component.scss']
})
export class QuotationDetailsComponent implements OnInit {
    quotationDetailsForm: FormGroup;

    QuotationProductDetailsStepper() {
        this.stepperService.changeIndex(2);
        this.router.navigateByUrl(
            '/flosure/create-quote/quotation-product-details'
        );
    }

    constructor(
        private _formBuilder: FormBuilder,
        private stepperService: StepperService,
        private readonly router: Router,
        private formBuilder: FormBuilder
    ) {
        this.quotationDetailsForm = this.formBuilder.group({
            client_type: '',
            client_id: '',
            currency: '',
            start_date: '',
            end_date: '',
            payment_method: '',
            branch: ''
        });
    }

    ngOnInit(): void {
        this.stepperService.toggleStepper(true);
        this.stepperService.changeIndex(1);
    }
}
