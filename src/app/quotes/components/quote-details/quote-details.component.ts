import { Component, OnInit } from '@angular/core';
import { Quote, MotorQuotationModel } from '../../models/quote.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';
import { ITimestamp } from 'src/app/claims/models/claim.model';
import { IDebitNoteDTO } from '../../models/debit-note.dto';
import { IQuoteDTO } from '../../models/quote.dto';
import { ICertificateDTO } from '../../models/certificate.dto';
import { combineLatest } from 'rxjs';

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

    isQuoteApproved = false;
    approvingQuote = false;

    //quoteNumber
    quoteNumber: string;
    quote: MotorQuotationModel = new MotorQuotationModel();

    selectedQuote: Quote;
    isEditmode = false;

    //modal
    isVisible = false;
    isConfirmLoading = false;

    // generated PDFs
    policyCertificateURl: string = '';
    debitNoteURL: string = '';
    quoteURL: string = '';

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

    generateDocuments(): void {
        this.approvingQuote = true;
        const debitNote: IDebitNoteDTO = {
            companyTelephone: 'Joshua Silwembe',
            companyEmail: 'joshua.silwembe@hobbiton.co.zm',
            vat: '5%',
            pin: '4849304930',
            todayDate: new Date(),
            agency: 'string',
            nameOfInsured: 'Joshua Silwembe',
            addressOfInsured: 'string',
            ref: 'string',
            policyNumber: 'string',
            endorsementNumber: 'string',
            regarding: 'string',
            classOfBusiness: 'string',
            brokerRef: 'string',
            fromDate: new Date(),
            toDate: new Date(),
            currency: 'string',
            basicPremium: 0,
            insuredPremiumLevy: 0,
            netPremium: 0,
            processedBy: 'string'
        };

        const certificate: ICertificateDTO = {
            certificateNumber: 'string',
            policyNumber: 'string',
            clientName: 'string',
            nameOfInsured: 'string',
            address: 'string',
            phone: 'string',
            email: 'james@gmail.com',
            coverType: 'string',
            startDate: new Date(),
            expiryDate: new Date(),
            sumInsured: 0,
            regMark: 'string',
            makeAndType: 'string',
            engine: 'string',
            chassisNumber: 'string',
            yearOfManufacture: 'string',
            color: 'string',
            branch: 'string',
            timeOfIssue: new Date(),
            dateOfIssue: new Date(),
            thirdPartyPropertyDamage: 0,
            thirdPartyInuryAndDeath: 0,
            thirdPartyBoodilyInjury_DeathPerEvent: 0,
            town: 'string'
        };

        const quote: IQuoteDTO = {
            quoteNumber: 'string',
            revisionNumber: 'string',
            startDate: new Date(),
            endDate: new Date(),
            client: 'string',
            status: 'Confirmed',
            preparedBy: 'string',
            motorQuotationModelId: 'string',
            dateCreated: new Date(),
            clientCode: 'string',
            messageCode: 'string',
            coverCode: 'string',
            currency: 'string',
            riskModelId: 'stirng',
            regNumber: 'string',
            vehicleMake: 'string',
            vehicleModel: 'string',
            engineNumber: 'string',
            chassisNumber: 'string',
            color: 'string',
            estimatedValue: 0,
            productType: 'Commercial',
            messageModelId: 'string',
            description: 'string',
            coverModelId: 'string'
        };

        const debit$ = this.quotesService.generateDebitNote(debitNote);

        const cert$ = this.quotesService.generateCertificate(certificate);

        const quote$ = this.quotesService.generateQuote(quote);

        combineLatest([debit$, cert$, quote$]).subscribe(
            ([debit, cert, quote]) => {
                this.debitNoteURL = debit.Location;
                this.policyCertificateURl = cert.Location;
                this.quoteURL = quote.Location;

                this.isQuoteApproved = true;
                this.approvingQuote = false;
            }
        );
    }
}
