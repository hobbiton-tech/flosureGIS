import { Component, OnInit } from '@angular/core';
import {
    Quote,
    MotorQuotationModel,
    RiskModel
} from '../../models/quote.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';
import { ITimestamp } from 'src/app/claims/models/claim.model';

@Component({
    selector: 'app-quote-details',
    templateUrl: './quote-details.component.html',
    styleUrls: ['./quote-details.component.scss']
})
export class QuoteDetailsComponent implements OnInit {
    //form
    quoteDetailsForm: FormGroup;

    //quotesLists
    quotesList: MotorQuotationModel[] = [];
    quotesLoading = true;

    //quoteNumber
    quoteNumber: string;
    quote: MotorQuotationModel = new MotorQuotationModel();

    selectedQuote: Quote;
    isEditmode = false;

    //modal
    isVisible = false;
    isConfirmLoading = false;

    constructor(
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private router: Router,
        private quotesService: QuotesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(param => {
            this.quoteNumber = param.quoteNumber;
            this.quotesService.getQuotes().subscribe(quotes => {
                this.quotesList = quotes;
                this.quote = this.quotesList.filter(
                    x => x.quoteNumber === this.quoteNumber
                )[0];

                console.log(this.quote);
                this.quotesLoading = false;
            });
        });

        this.quoteDetailsForm = this.formBuilder.group({
            client: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            currency: [`${this.quote.currency}`, Validators.required],
            product: ['', Validators.required],
            model: ['', Validators.required],
            color: ['', Validators.required],
            chassisNumber: ['', Validators.required],
            regNumber: ['', Validators.required],
            make: ['', Validators.required],
            type: ['', Validators.required],
            engineNumber: ['', Validators.required],
            quater: ['', Validators.required],
            town: ['', Validators.required],
            preparedBy: ['', Validators.required],
            paymentMethod: ['', Validators.required],
            sumInsured: ['', Validators.required]
        });
    }

    handlePayment() {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isConfirmLoading = true;
        setTimeout(() => {
            this.isVisible = false;
            this.isConfirmLoading = false;
            //route to policy details
            this.router.navigateByUrl('/flosure/underwriting/policies');
        }, 3000);

        console.log(this.quoteDetailsForm.value);
        //push to convert quote to policy and policies collection
        const policy = this.quoteDetailsForm.value as Policy;
        this.policiesService.addPolicy(policy);
    }

    getTimeStamp(quote: MotorQuotationModel): number {
        if (!this.quotesLoading) {
            return (quote.startDate as ITimestamp).seconds;
        }
    }

    getEndDateTimeStamp(quote: MotorQuotationModel): number {
        if (!this.quotesLoading) {
            return (quote.endDate as ITimestamp).seconds;
        }
    }

    handleCancel(): void {
        this.isVisible = false;
    }
}
