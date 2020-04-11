import { Component, OnInit } from '@angular/core';
import {
    Quote,
    MotorQuotationModel,
    RiskModel,
    LoadModel,
} from '../../models/quote.model';
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
    styleUrls: ['./quote-details.component.scss'],
})
export class QuoteDetailsComponent implements OnInit {
    // form
    quoteDetailsForm: FormGroup;

    // quotesLists
    quotesList: MotorQuotationModel[] = [];
    quotesLoading = true;
    risks: RiskModel[] = [];

    /// Premium Computation
    // Basic Premium
    basicPremium: number;
    basicPremiumLevy: number;
    basicPremiumSubTotal: number;
    sumInsured: number;
    premiumRate: number;
    premiumRateType: string;
    // Loading
    premiumLoadingsubTotal: number;

    increasedThirdPartyLimitsRate: number;
    increasedThirdPartyLimitsAmount: number;
    increasedThirdPartyLimitsRateType: string;
    increasedThirdPartyLimitValue: number;

    riotAndStrikeRate: number;
    riotAndStrikeAmount: number;
    riotAndStrikeRateType: string;

    carStereoValue: number;
    carStereoRate: number;
    carStereoRateType: string;
    carStereoAmount: number;

    territorailExtensionRateType: string;

    lossOfUseDailyRate: number;
    lossOfUseDailyRateType: string;
    lossOfUseDays: number;
    lossOfUseAmount: number;

    // Discount
    premiumDiscountRate: number;
    premiumDiscountRateType: string;
    premiumDiscount: number;
    premiumDiscountSubtotal: number;
    // Net or total premium
    totalPremium: number;
    netPremium: number;

    // Loading
    addingLoad: boolean;

    // loads added to loading
    loads: LoadModel[] = [];

    // loading feedback
    computeBasicPremiumIsLoading = false;
    computeIncreasedThirdPartyLimitIsLoading = false;
    computeRiotAndStrikeIsLoading = false;
    computeCarStereoIsLoading = false;
    computeTerritorialExtensionIsLoading = false;
    computeLossOfUseIsLoading = false;
    computeDiscountIsLoading = false;

    addLoadIsLoading = false;

    status = 'Unreceipted';

    loadingOptions = [
        {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits',
        },
        { label: 'Riot and strike', value: 'riotAndStrike' },
        { label: 'Car Stereo', value: 'carStereo' },
        { label: 'Territorial Extension', value: 'territorailExtension' },
        { label: 'Loss Of Use', value: 'lossOfUse' },
    ];

    selectedLoadingValue = {
        label: 'Increased Third Party Limit',
        value: 'increasedThirdPartyLimits',
    };

    quoteData: MotorQuotationModel = new MotorQuotationModel();

    isQuoteApproved = false;
    approvingQuote = false;

    // quoteNumber
    quoteNumber: string;
    quote: MotorQuotationModel = new MotorQuotationModel();
    displayQuote: MotorQuotationModel;

    selectedQuote: Quote;
    isEditmode = false;

    // modal
    isVisible = false;
    isConfirmLoading = false;
    showDocumentModal = false;

    searchString: string;

    // generated PDFs
    policyCertificateURl = '';
    showCertModal = false;

    debitNoteURL = '';
    showDebitModal = false;

    quoteURL = '';
    showQuoteModal = false;

    paymentPlan = 'NotCreated';

    constructor(
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private router: Router,
        private quotesService: QuotesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((param) => {
            this.quoteNumber = param.quoteNumber;
            this.quotesService.getQuotes().subscribe((quotes) => {
                this.quoteData = quotes.filter(
                    (x) => x.quoteNumber === this.quoteNumber
                )[0];
                this.quotesList = quotes;
                console.log(quotes);
                this.quote = this.quotesList.filter(
                    (x) => x.quoteNumber === this.quoteNumber
                )[0];

                this.displayQuote = this.quote;

                this.isQuoteApproved = this.quote.status === 'Approved';

                console.log(this.quote);
                this.quotesLoading = false;

                // Basic Premium
                this.sumInsured = this.quoteData.sumInsured;
                this.premiumRate = this.quoteData.premiumRate;
                this.basicPremium = this.quoteData.basicPremium;
                this.basicPremiumLevy = this.quoteData.premiumLevy;
                this.basicPremiumSubTotal = this.quoteData.basicPremiumSubTotal;

                // Loads
                this.loads = this.quoteData.loads;
                this.premiumLoadingsubTotal = this.quoteData.loadingSubTotal;

                // discount
                this.premiumDiscountRate = this.quoteData.discountRate;
                this.premiumDiscount = this.quoteData.discount;
                this.premiumDiscountSubtotal = this.quoteData.discountSubTotal;

                // total premium
                this.totalPremium = this.quoteData.netPremium;
                this.netPremium = this.totalPremium + this.basicPremiumLevy;
            });
        });

        this.quoteDetailsForm = this.formBuilder.group({
            client: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: [''],
            currency: [`${this.quote.currency}`, Validators.required],
            branch: ['', Validators.required],
            product: ['', Validators.required],
            quarter: ['', Validators.required],
            underwritingYear: ['', Validators.required],
        });
    }

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

    handleOk(): void {
        this.isConfirmLoading = true;
        setTimeout(() => {
            this.isVisible = false;
            this.isConfirmLoading = false;
            this.router.navigateByUrl('/flosure/underwriting/policies');
        }, 3000);

        console.log(this.quoteDetailsForm.value);
        // push to convert quote to policy and policies collection
        const policy = this.quoteDetailsForm.value as Policy;

        this.policiesService.addPolicy(policy);
    }

    getTimeStamp(quote: MotorQuotationModel): number {
        if (!this.quotesLoading) {
            return (quote.startDate as ITimestamp).seconds;
        }
    }

    getYearTimeStamp(quote: MotorQuotationModel): number {
        if (!this.quotesLoading) {
            return (quote.underwritingYear as ITimestamp).seconds;
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
            processedBy: 'string',
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
            town: 'string',
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
            coverModelId: 'string',
        };

        const debit$ = this.quotesService.generateDebitNote(debitNote);
        const cert$ = this.quotesService.generateCertificate(certificate);
        const quote$ = this.quotesService.generateQuote(quote);

        combineLatest([debit$, cert$, quote$]).subscribe(
            async ([debit, cert, quote]) => {
                this.debitNoteURL = debit.Location;
                this.policyCertificateURl = cert.Location;
                this.quoteURL = quote.Location;

                // await this.quotesService.addQuoteDocuments()

                this.quote.status = 'Approved';
                await this.quotesService.updateQuote(this.quote);

                // convert to policy
                const policy: Policy = {
                    ...this.quoteDetailsForm.value,
                    receiptStatus: this.status,
                    risks: this.quoteData.risks,
                    sumInsured: this.quoteData.sumInsured,
                    netPremium: this.quoteData.netPremium,
                    paymentPlan: this.paymentPlan,
                    user: this.quoteData.user,
                };

                // const policy = this.quoteDetailsForm.value as Policy;
                this.policiesService.addPolicy(policy);

                this.isQuoteApproved = true;
                this.approvingQuote = false;
            }
        );
    }

    // filter by search
    search(value: string): void {
        if (value === '' || !value) {
            this.displayQuote = this.quote;
        }

        this.displayQuote.risks = this.quote.risks.filter((quote) => {
            return (
                quote.insuranceType
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.regNumber.toLowerCase().includes(value.toLowerCase()) ||
                quote.chassisNumber
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.vehicleMake.toLowerCase().includes(value.toLowerCase()) ||
                quote.vehicleModel
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.engineNumber
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.productType.toLowerCase().includes(value.toLowerCase()) ||
                quote.color.toLowerCase().includes(value.toLowerCase())
            );
        });
    }

    // Premium computation methods
    // Basic Premum Computation
    computeBasicPremium() {
        this.computeBasicPremiumIsLoading = true;
        setTimeout(() => {
            if (this.premiumRateType === 'percentage') {
                this.basicPremium = this.sumInsured * (this.premiumRate / 100);
            } else {
                this.basicPremium = +this.sumInsured + +this.premiumRate;
            }
            this.basicPremiumSubTotal = this.basicPremium;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;
            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.computeBasicPremiumIsLoading = false;
        }, 2000);
    }

    // Loading computation
    computeRiotAndStrike() {
        this.computeRiotAndStrikeIsLoading = true;
        setTimeout(() => {
            if (this.riotAndStrikeRateType === 'percentage') {
                this.riotAndStrikeAmount =
                    this.basicPremium * (this.riotAndStrikeRate / 100);
            } else {
                this.riotAndStrikeAmount = +this.riotAndStrikeRate;
            }

            this.loads.push({
                loadType: 'Riot And Strike',
                amount: this.riotAndStrikeAmount,
            });
            this.premiumLoadingsubTotal =
                this.premiumDiscountSubtotal + this.riotAndStrikeAmount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeRiotAndStrikeIsLoading = false;
        }, 2000);
    }

    computeIncreasedThirdPartyLimit() {
        this.computeIncreasedThirdPartyLimitIsLoading = true;
        setTimeout(() => {
            if (this.increasedThirdPartyLimitsRateType === 'percentage') {
                this.increasedThirdPartyLimitsAmount =
                    (+this.increasedThirdPartyLimitValue - 100200) *
                    (this.increasedThirdPartyLimitsRate / 100);
            } else {
                this.increasedThirdPartyLimitsAmount = this.increasedThirdPartyLimitsRate;
            }
            this.loads.push({
                loadType: 'Increased Third Party Limit',
                amount: this.increasedThirdPartyLimitsAmount,
            });

            this.premiumLoadingsubTotal =
                this.premiumLoadingsubTotal +
                this.increasedThirdPartyLimitsAmount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeIncreasedThirdPartyLimitIsLoading = false;
        }, 2000);
    }

    computeCarStereo() {
        this.computeCarStereoIsLoading = true;
        setTimeout(() => {
            if (this.carStereoRateType === 'percentage') {
                this.carStereoAmount =
                    this.carStereoValue * (this.carStereoRate / 100);
            } else {
                this.carStereoAmount = +this.carStereoRate;
            }

            this.loads.push({
                loadType: 'Car Stereo',
                amount: this.carStereoAmount,
            });
            this.premiumLoadingsubTotal =
                this.premiumLoadingsubTotal + this.carStereoAmount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeCarStereoIsLoading = false;
        }, 2000);
    }

    computeTerritorialExtension() {
        this.computeTerritorialExtensionIsLoading = true;
        setTimeout(() => {
            this.loads.push({
                loadType: 'Territorial Extension',
                amount: 1750,
            });
            this.premiumLoadingsubTotal = this.premiumLoadingsubTotal + 1750;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeTerritorialExtensionIsLoading = false;
        }, 2000);
    }

    computeLossOfUse() {
        this.computeLossOfUseIsLoading = true;
        setTimeout(() => {
            if (this.lossOfUseDailyRateType === 'percentage') {
                this.lossOfUseAmount =
                    this.lossOfUseDays *
                    (this.basicPremium * (this.lossOfUseDailyRate / 100));
            } else {
                this.lossOfUseAmount =
                    this.lossOfUseDays * this.lossOfUseDailyRate;
            }

            this.loads.push({
                loadType: 'Loss Of Use',
                amount: this.lossOfUseAmount,
            });
            this.premiumLoadingsubTotal =
                this.premiumLoadingsubTotal + this.lossOfUseAmount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeLossOfUseIsLoading = false;
        }, 2000);
    }

    // Discount Computation
    computeDiscount() {
        this.computeDiscountIsLoading = true;
        setTimeout(() => {
            if (this.premiumDiscountRateType == 'percentage') {
                this.premiumDiscount =
                    (this.basicPremiumSubTotal + this.premiumLoadingsubTotal) *
                    (this.premiumDiscountRate / 100);
            } else {
                this.premiumDiscount = this.premiumDiscountRate;
            }

            this.premiumDiscountSubtotal = this.premiumDiscount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.computeDiscountIsLoading = false;
        }, 2000);
    }
}
