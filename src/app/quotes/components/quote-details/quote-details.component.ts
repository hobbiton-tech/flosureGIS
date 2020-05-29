import { Component, OnInit } from '@angular/core';
import {
    MotorQuotationModel,
    RiskModel,
    LoadModel,
    DiscountType,
    DiscountModel
} from '../../models/quote.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import { ITimestamp } from 'src/app/claims/models/claim.model';
import { IDebitNoteDTO } from '../../models/debit-note.dto';
import { ICertificateDTO } from '../../models/certificate.dto';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import {
    IIndividualClient,
    ICorporateClient
} from 'src/app/clients/models/clients.model';
import { UploadChangeParam, NzMessageService } from 'ng-zorro-antd';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import _ from 'lodash';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import {
    IBroker,
    IAgent,
    ISalesRepresentative
} from 'src/app/settings/components/agents/models/agents.model';
import { ImageElement } from 'canvg';
import { DebitNote } from 'src/app/underwriting/documents/models/documents.model';

type AOA = any[][];

interface IRateResult {
    sumInsured: string;
    endDate: string;
    quarter: string;
    totalPremium: string;
    riotAndStrikePremium: string;
    basicPremium: string;
    thirdPartyLoadingPremium: string;
    carStereoPremium: string;
    lossOfUsePremium: string;
    territorialExtensionPremium: string;
    discount: string;
}

interface IRateRequest {
    sumInsured: number;
    premiumRate: number;
    startDate: Date;
    quarter: number;
    appliedDiscount: number;
    discount: number;
    carStereo: number;
    carStereoRate: number;
    lossOfUseDays: number;
    lossOfUseRate: number;
    territorialExtensionWeeks: number;
    territorialExtensionCountries: number;
    thirdPartyLimit: number;
    thirdPartyLimitRate: number;
    riotAndStrike: number;
    levy: number;
}

@Component({
    selector: 'app-quote-details',
    templateUrl: './quote-details.component.html',
    styleUrls: ['./quote-details.component.scss']
})
export class QuoteDetailsComponent implements OnInit {
    // form
    quoteDetailsForm: FormGroup;
    riskThirdPartyForm: FormGroup;
    riskComprehensiveForm: FormGroup;
    clients: Array<IIndividualClient & ICorporateClient>;

    //intermediaries
    brokers: IBroker[];
    agents: IAgent[];
    salesRepresentatives: ISalesRepresentative[];
    intermediaries: Array<IAgent & IBroker & ISalesRepresentative>;

    broker: IBroker;
    agent: IAgent;
    salesRepresentative: ISalesRepresentative;

    // vehicle make drop down
    vehicleMakeUrl = 'https://api.randomuser.me/?results=5';
    searchChange$ = new BehaviorSubject('');
    vehicleMakeOptionList: string[] = [];
    selectedVehicleMake: string;
    isVehicleMakeLoading = false;

    // vehicle model drop down
    vehicleModelUrl = 'https://api.randomuser.me/?results=5';
    // searchChange$ = new BehaviorSubject('');
    vehicleModelOptionList: string[] = [];
    selectedVehicleModel: string;
    isVehicleModelLoading = false;

    //set risk tamplate table not vivible
    isTabletemplate = true;

    // excel template data
    data: AOA = [
        [1, 2],
        [3, 4]
    ];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    /*name of the risks template that will be downloaded. */
    fileName = 'Risks_template.xlsx';
    fileLocation: string;

    // quotesLists
    quotesList: MotorQuotationModel[] = [];
    quotesLoading = true;
    risks: RiskModel[] = [];
    numberOfRisks: number;

    // selected risk in risk table
    selectedRisk: RiskModel;

    // risk being edited
    currentRiskEdit: RiskModel;

    // risk details modal
    quoteRiskDetailsModalVisible = false;

    // Edit risk details
    isRiskDetailsEditmode = false;

    // close add risk panel
    isAddRiskPanelOpen: boolean;

    /// Premium Computation
    // Basic Premium
    basicPremium: number;
    basicPremiumLevy: number;
    basicPremiumSubTotal: number;
    sumInsured: number;
    premiumRate: number;
    premiumRateType: string;
    // Loading
    premiumLoadingTotal: number;
    premiumLoadingsubTotal: number;

    totalSumInsured: number;
    totalBasicPremium: number;
    totalLevy: number;
    totalNetPremium: number;

    LevyRate: number = 3;

    increasedThirdPartyLimitsRate: number;
    increasedThirdPartyLimitsAmount: number;
    increasedThirdPartyLimitsRateType: string;
    increasedThirdPartyLimitValue: number;

    riotAndStrikeRate: number;
    // riotAndStrikeAmount: number;
    riotAndStrikeRateType: string;

    carStereoValue: number;
    carStereoRate: number;
    carStereoRateType: string;
    // carStereoAmount: number;

    territorialExtensionRateType: string;
    territorialExtensionWeeks: number;
    territorialExtensionCountries: number;

    lossOfUseDailyRate: number;
    lossOfUseDailyRateType: string;
    lossOfUseDays: number;
    // lossOfUseAmount: number;

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

    //dicounts added
    discounts: DiscountModel[] = [];

    //for quote document
    quoteBasicPremium: number;
    quoteLoadingTotal: number;
    quoteDiscountTotal: number;
    quoteSumInsured: number;
    quoteLevy: number;
    quoteNetPremium: number;

    // loading feedback
    computeBasicPremiumIsLoading = false;
    computeIncreasedThirdPartyLimitIsLoading = false;
    computeRiotAndStrikeIsLoading = false;
    computeCarStereoIsLoading = false;
    computeTerritorialExtensionIsLoading = false;
    computeLossOfUseIsLoading = false;
    computeDiscountIsLoading = false;
    computePremiumIsLoading = false;

    addLoadIsLoading = false;

    status = 'Unreceipted';

    //selected basic premium input type option are rate and amount
    selectedBasicPremiunTypeValue = 'rate';
    //basic premium amount when user selects amount as basic premium input type
    basicPremiumAmount: number;

    //selected increase third party input type
    selectedIncreaseThirdPartyLimitInputTypeValue = 'rate';
    //increase third party amount
    increasedThirdPartyLimitAmount: number;

    //selected riot and strike input type
    selectedRiotAndStrikeInputTypeValue = 'rate';
    //increase third party amount
    riotAndStrikeAmount: number;

    //selected Car stereo input type
    selectedCarStereoInputTypeValue = 'rate';
    //car stereo amount
    carStereoAmount: number;

    //selected loss of use input type
    selectedLossOfUseInputTypeValue = 'rate';
    //car stereo amount
    lossOfUseAmount: number;

    //selected territorial extension input type
    selectedTerritorialExtensionInputTypeValue = 'rate';
    //loss of use amount
    territorialExtensionAmount: number;

    //inexperienced driver amount
    inexperiencedDriverAmount: number;

    //under age driver amount
    underAgeDriverAmount: number;

    //selected no claim discount input type
    selectedNoClaimsDiscountInputTypeValue = 'rate';
    //no claim discount amount
    noClaimsDiscountAmount: number;

    //selected loyalty discount input type
    selectedLoyaltyDiscountInputTypeValue = 'rate';
    //loyalty discount amount
    loyaltyDiscountAmount: number;

    //selected valued client discount input type
    selectedValuedClientDiscountInputTypeValue = 'rate';
    //valued client discount amount
    valuedClientDiscountAmount: number;

    //selected low term agreement discount input type
    selectedLowTermAgreementDiscountInputTypeValue = 'rate';
    //low term agreement discount amount
    lowTermAgreementDiscountAmount: number;

    optionList = [
        { label: 'Motor Comprehensive', value: 'Comprehensive' },
        { label: 'Motor Third Party', value: 'ThirdParty' }
    ];
    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    motorComprehensiveloadingOptions = [
        {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits'
        },
        { label: 'Riot and strike', value: 'riotAndStrike' },
        { label: 'Car Stereo', value: 'carStereo' },
        { label: 'Territorial Extension', value: 'territorailExtension' },
        { label: 'Loss Of Use', value: 'lossOfUse' },
        { label: 'Inexperienced Driver', value: 'inexperiencedDriver' },
        { label: 'Under Age Driver', value: 'underAgeDriver' }
    ];

    motorThirdPartyloadingOptions = [
        {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits'
        }
    ];

    selectedLoadingValue = {
        label: '',
        value: ''
    };

    //discounts
    discountOptions = [
        { label: 'No claims dicount', value: 'noClaimsDiscount' },
        { label: 'Loyalty Discount', value: 'loyaltyDiscount' },
        { label: 'Valued Client Discount', value: 'valuedClientDiscount' },
        { label: 'Low Term Agreement', value: 'lowTermAgreementDiscount' }
    ];

    selectedDiscountValue = { label: '', value: '' };

    selectedSourceOfBusiness: string;

    sourceOfBusinessOptions = [
        { label: 'Direct', value: 'direct' },
        { label: 'Broker', value: 'broker' },
        { label: 'Agent', value: 'agent' },
        { label: 'Sales Representative', value: 'salesRepresentative' }
    ];

    quoteData: MotorQuotationModel = new MotorQuotationModel();

    isQuoteApproved = false;
    approvingQuote = false;

    // quoteNumber
    quoteNumber: string;
    quote: MotorQuotationModel = new MotorQuotationModel();
    displayQuote: MotorQuotationModel;

    //source of business details
    sourceOfBusiness: string;

    selectedQuote: MotorQuotationModel;
    isEditmode = false;

    // modal
    isVisible = false;
    isConfirmLoading = false;
    showDocumentModal = false;

    // Quote PDFs modal
    isViewQuotePDFVisible = false;
    isViewDraftQuotePDFVisible = false;

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
        private readonly clientsService: ClientsService,
        private route: ActivatedRoute,
        private msg: NzMessageService,
        private http: HttpClient,
        private readonly agentsService: AgentsService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(param => {
            this.quoteNumber = param.quoteNumber;
            this.quotesService.getMotorQuotations().subscribe(quotes => {
                this.quoteData = quotes.filter(
                    x => x.quoteNumber === this.quoteNumber
                )[0];
                this.quotesList = quotes;
                this.quote = this.quotesList.filter(
                    x => x.quoteNumber === this.quoteNumber
                )[0];
                console.log('this.quote>>>>>', this.quoteData);

                this.risks = this.quoteData.risks;

                // if (this.quoteData.sourceOfBusiness == 'Agent') {
                //     this.agent = this.intermediaries.filter(
                //         x => x.intermediaryId == this.quoteData.intermediaryId
                //     )[0];
                // }
                // if (this.quoteData.sourceOfBusiness == 'Broker') {
                //     this.broker = this.intermediaries.filter(
                //         x => x.intermediaryId == this.quoteData.intermediaryId
                //     )[0];
                // }
                // if (this.quoteData.sourceOfBusiness == 'Sales Representative') {
                //     this.salesRepresentative = this.intermediaries.filter(
                //         x => x.intermediaryId == this.quoteData.intermediaryId
                //     )[0];
                // }

                this.displayQuote = this.quote;

                this.isQuoteApproved = this.quote.status === 'Approved';

                this.quotesLoading = false;

                // fill quotation details
                this.quoteDetailsForm
                    .get('client')
                    .setValue(this.quoteData.client);
                this.quoteDetailsForm
                    .get('currency')
                    .setValue(this.quoteData.currency);
                this.quoteDetailsForm
                    .get('sourceOfBusiness')
                    .setValue(this.quoteData.sourceOfBusiness, {
                        onlySelf: true
                    });
                this.quoteDetailsForm
                    .get('intermediaryName')
                    .setValue(this.quoteData.intermediaryName);

                if (this.quoteData.sourceOfBusiness == 'Agent') {
                    this.quoteDetailsForm
                        .get('intermediaryName')
                        .setValue(this.quoteData.intermediaryName);
                }
                if (this.quoteData.sourceOfBusiness == 'Broker') {
                    this.quoteDetailsForm
                        .get('intermediaryName')
                        .setValue(this.quoteData.intermediaryName);
                }
                if (this.quoteData.sourceOfBusiness == 'Sales Representative') {
                    this.quoteDetailsForm
                        .get('intermediaryName')
                        .setValue(this.quoteData.intermediaryName);
                }

                this.quoteDetailsForm
                    .get('startDate')
                    .setValue(this.quoteData.startDate);
                this.quoteDetailsForm
                    .get('quarter')
                    .setValue(this.quoteData.quarter);
                this.quoteDetailsForm
                    .get('endDate')
                    .setValue(this.quoteData.endDate);

                this.numberOfRisks = this.risks.length;
                this.premiumLoadingTotal = 0;
            });
        });

        this.clientsService.getAllClients().subscribe(clients => {
            this.clients = [...clients[0], ...clients[1]] as Array<
                IIndividualClient & ICorporateClient
            >;
        });

        this.agentsService.getAgents().subscribe(agents => {
            this.agents = agents;
        });

        this.agentsService.getBrokers().subscribe(brokers => {
            this.brokers = brokers;
        });

        this.agentsService
            .getSalesRepresentatives()
            .subscribe(salesRepresentatives => {
                this.salesRepresentatives = salesRepresentatives;
            });

        this.agentsService.getAllIntermediaries().subscribe(intermediaries => {
            this.intermediaries = [
                ...intermediaries[0],
                ...intermediaries[1],
                ...intermediaries[2]
            ] as Array<IAgent & IBroker & ISalesRepresentative>;
        });

        // start of initialize computations
        this.sumInsured = 0;
        this.premiumRate = 0;

        this.basicPremium = 0;
        this.premiumLoadingTotal = 0;
        this.premiumDiscount = 0;
        this.premiumDiscountRate = 0;
        this.basicPremiumLevy = 0;
        this.netPremium = 0;

        this.premiumDiscount = 0;
        this.carStereoValue = 0;
        this.carStereoRate = 0;
        this.lossOfUseDays = 0;
        this.lossOfUseDailyRate = 0;
        this.increasedThirdPartyLimitValue = 0;
        this.increasedThirdPartyLimitsRate = 0;
        this.riotAndStrikeRate = 0;

        // rate should be in percentage when page is loaded
        this.premiumRateType = 'percentage';
        this.increasedThirdPartyLimitsRateType = 'percentage';
        this.riotAndStrikeRateType = 'percentage';
        this.carStereoRateType = 'percentage';
        this.lossOfUseDailyRateType = 'percentage';
        this.premiumDiscountRateType = 'percentage';

        this.quoteDetailsForm = this.formBuilder.group({
            client: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: [''],
            currency: [`${this.quote.currency}`, Validators.required],
            branch: ['', Validators.required],
            product: ['', Validators.required],
            quarter: ['', Validators.required],
            underwritingYear: ['', Validators.required],
            sourceOfBusiness: ['', Validators.required],
            intermediaryName: ['', Validators.required]
        });

        this.riskComprehensiveForm = this.formBuilder.group({
            riskStartDate: ['', Validators.required],
            riskQuarter: ['', Validators.required],
            riskEndDate: ['', Validators.required],
            regNumber: ['', Validators.required],
            vehicleMake: ['', Validators.required],
            vehicleModel: ['', Validators.required],
            engineNumber: ['', Validators.required],
            chassisNumber: ['', Validators.required],
            yearOfManufacture: ['', Validators.required],
            color: ['', Validators.required],
            productType: ['', Validators.required],
            insuranceType: ['Comprehensive']
        });

        this.riskThirdPartyForm = this.formBuilder.group({
            riskStartDate: ['', Validators.required],
            riskQuarter: ['', Validators.required],
            riskEndDate: ['', Validators.required],
            regNumber: ['', [Validators.required]],
            vehicleMake: ['', [Validators.required]],
            vehicleModel: ['', [Validators.required]],
            engineNumber: ['', [Validators.required]],
            chassisNumber: ['', [Validators.required]],
            yearOfManufacture: ['', Validators.required],
            color: ['', [Validators.required]],
            productType: ['', [Validators.required]],
            insuranceType: ['ThirdParty']
        });

        // vehicle make loading
        const getVehicleMakeList = (name: string) =>
            this.http
                .get(`${this.vehicleMakeUrl}`)
                .pipe(map((res: any) => res.results))
                .pipe(
                    map((list: any) => {
                        return list.map((item: any) => `${name}`);
                    })
                );

        const vehicleMakeOptionList$: Observable<string[]> = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getVehicleMakeList));
        vehicleMakeOptionList$.subscribe(data => {
            this.vehicleMakeOptionList = data;
            this.isVehicleMakeLoading = false;
        });

        // vehicle model loading
        const getVehicleModelList = (name: string) =>
            this.http
                .get(`${this.vehicleModelUrl}`)
                .pipe(map((res: any) => res.results))
                .pipe(
                    map((list: any) => {
                        return list.map((item: any) => `${name}`);
                    })
                );

        const vehicleModelOptionList$: Observable<string[]> = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getVehicleModelList));
        vehicleModelOptionList$.subscribe(data => {
            this.vehicleModelOptionList = data;
            this.isVehicleModelLoading = false;
        });
    }

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o2.value === o2.value : o1 === o2;

    resetForms() {
        this.riskComprehensiveForm.reset();
        this.riskThirdPartyForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
    }

    // End date calculation
    handleComprehensiveRiskEndDateCalculation(): void {
        if (
            this.riskComprehensiveForm.get('riskStartDate').value !== '' &&
            this.riskComprehensiveForm.get('riskQuarter').value !== ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.riskComprehensiveForm.get('riskStartDate')
                    .value,
                quarter: Number(
                    this.riskComprehensiveForm.get('riskQuarter').value
                ),
                discount: 0,
                appliedDiscount: 0,
                carStereo: 0,
                carStereoRate: 0,
                territorialExtensionWeeks: 0,
                territorialExtensionCountries: 0,
                lossOfUseDays: 0,
                lossOfUseRate: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy: 0
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.riskComprehensiveForm
                        .get('riskEndDate')
                        .setValue(data.endDate);
                });
        }
    }

    handleThirdPartyRiskEndDateCalculation(): void {
        this.handleBasicPremiumCalculationThirdParty();
        if (
            this.riskThirdPartyForm.get('riskStartDate').value !== '' &&
            this.riskThirdPartyForm.get('riskQuarter').value !== ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.riskThirdPartyForm.get('riskStartDate').value,
                quarter: Number(
                    this.riskThirdPartyForm.get('riskQuarter').value
                ),
                discount: 0,
                appliedDiscount: 0,
                carStereo: 0,
                carStereoRate: 0,
                territorialExtensionWeeks: 0,
                territorialExtensionCountries: 0,
                lossOfUseDays: 0,
                lossOfUseRate: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy: 0
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.riskThirdPartyForm
                        .get('riskEndDate')
                        .setValue(data.endDate);
                });
        }
    }

    handlePolicyEndDateCalculation(): void {
        if (
            this.quoteDetailsForm.get('startDate').value !== '' &&
            this.quoteDetailsForm.get('quarter').value !== ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.quoteDetailsForm.get('startDate').value,
                quarter: Number(this.quoteDetailsForm.get('quarter').value),
                discount: 0,
                appliedDiscount: 0,
                carStereo: 0,
                carStereoRate: 0,
                territorialExtensionWeeks: 0,
                territorialExtensionCountries: 0,
                lossOfUseDays: 0,
                lossOfUseRate: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy: 0
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.quoteDetailsForm.get('endDate').setValue(data.endDate);
                });
        }
    }

    handleBasicPremiumCalculation(): void {
        if (this.sumInsured != 0 && this.premiumRate != 0) {
            const request: IRateRequest = {
                sumInsured: Number(this.sumInsured),
                premiumRate: Number(this.premiumRate) / 100,
                startDate: this.riskComprehensiveForm.get('riskStartDate')
                    .value,
                quarter: Number(
                    this.riskComprehensiveForm.get('riskQuarter').value
                ),
                discount: 0,
                appliedDiscount: 0,
                carStereo: 0,
                carStereoRate: 0,
                territorialExtensionWeeks: 0,
                territorialExtensionCountries: 0,
                lossOfUseDays: 0,
                lossOfUseRate: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy: 0
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.basicPremium = Number(data.basicPremium);
                    this.handleNetPremium();
                });
        }
    }

    addThirdPartyRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskThirdPartyForm.value,
            sumInsured: this.sumInsured,
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            loads: this.loads,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: 0.03,
            netPremium: this.netPremium,
            insuranceType: this.selectedValue.value
        });
        this.risks = [...this.risks, ...some];

        // reset form after submitting
        this.riskThirdPartyForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);

        this.isAddRiskPanelOpen = false;
        console.log(this.risks);
    }

    // reset third party risk form
    resetThirdPartyRiskForm(e: MouseEvent) {
        e.preventDefault();
        this.riskComprehensiveForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
    }

    addComprehensiveRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskComprehensiveForm.value,
            sumInsured: this.sumInsured,
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: 0.03,
            netPremium: this.netPremium,
            insuranceType: this.selectedValue.value
        });
        this.risks = [...this.risks, ...some];

        // reset form after submitting
        this.riskComprehensiveForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);

        this.isAddRiskPanelOpen = false;
    }

    // reset comprehensive risk form
    resetComprehensiveRiskForm(e: MouseEvent) {
        e.preventDefault();
        this.riskComprehensiveForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
        this.selectedRisk = risk;
        this.quoteRiskDetailsModalVisible = true;

        if (this.selectedValue.value === 'Comprehensive') {
            this.riskComprehensiveForm
                .get('vehicleMake')
                .setValue(risk.vehicleMake);
            this.riskComprehensiveForm
                .get('vehicleModel')
                .setValue(risk.vehicleModel);
            this.riskComprehensiveForm
                .get('yearOfManufacture')
                .setValue(this.getYearOfManfTimeStamp(this.selectedRisk));
            this.riskComprehensiveForm
                .get('regNumber')
                .setValue(risk.regNumber);
            this.riskComprehensiveForm
                .get('engineNumber')
                .setValue(risk.engineNumber);
            this.riskComprehensiveForm
                .get('chassisNumber')
                .setValue(risk.chassisNumber);
            this.riskComprehensiveForm
                .get('productType')
                .setValue(risk.productType);
            this.riskComprehensiveForm
                .get('riskStartDate')
                .setValue(risk.riskStartDate);
            this.riskComprehensiveForm
                .get('riskQuarter')
                .setValue(risk.riskQuarter);
            this.riskComprehensiveForm
                .get('riskEndDate')
                .setValue(risk.riskEndDate);
            this.riskComprehensiveForm.get('color').setValue(risk.color);
        } else {
            this.riskComprehensiveForm
                .get('vehicleMake')
                .setValue(risk.vehicleMake);
            this.riskComprehensiveForm
                .get('vehicleModel')
                .setValue(risk.vehicleModel);
            this.riskComprehensiveForm
                .get('yearOfManufacture')
                .setValue(risk.yearOfManufacture);
            this.riskThirdPartyForm.get('regNumber').setValue(risk.regNumber);
            this.riskThirdPartyForm
                .get('engineNumber')
                .setValue(risk.engineNumber);
            this.riskThirdPartyForm
                .get('chassisNumber')
                .setValue(risk.chassisNumber);
            this.riskThirdPartyForm
                .get('productType')
                .setValue(risk.productType);
            this.riskThirdPartyForm
                .get('riskStartDate')
                .setValue(risk.riskStartDate);
            this.riskThirdPartyForm
                .get('riskQuarter')
                .setValue(risk.riskQuarter);
            this.riskThirdPartyForm
                .get('riskEndDate')
                .setValue(risk.riskEndDate);
            this.riskThirdPartyForm.get('color').setValue(risk.color);
        }

        this.selectedVehicleMake = risk.vehicleMake;
        this.selectedVehicleModel = risk.vehicleModel;
        this.sumInsured = risk.sumInsured;
        this.premiumRate = risk.premiumRate;
        this.loads = risk.loads;
        this.discounts = risk.discounts;
        this.basicPremium = risk.basicPremium;
        this.premiumDiscountRate = risk.discountRate;
        this.premiumDiscount = risk.discountTotal;
        this.premiumLoadingTotal = risk.loadingTotal;
        this.basicPremiumLevy = risk.premiumLevy;
        this.netPremium = risk.netPremium;
    }

    // remove risk from risks table
    removeRisk(regNumber: string): void {
        this.risks = this.risks.filter(risk => risk.regNumber !== regNumber);
    }

    //save risks changes after editing
    saveRisk(): void {
        this.currentRiskEdit = this.selectedRisk;
        console.log(this.currentRiskEdit);

        if (this.selectedValue.value === 'Comprehensive') {
            //comprehensive risk
            const some: RiskModel = {
                ...this.riskComprehensiveForm.value,
                sumInsured: Number(this.sumInsured),
                premiumRate: this.premiumRate,
                basicPremium: this.basicPremium,
                loads: this.loads,
                loadingTotal: this.premiumLoadingTotal,
                discountRate: this.premiumDiscountRate,
                premiumLevy: this.basicPremiumLevy,
                netPremium: this.netPremium,
                insuranceType: this.selectedValue.value
            };
            this.currentRiskEdit = some;

            var riskIndex = _.findIndex(this.risks, {
                id: this.selectedRisk.id
            });
            this.risks.splice(riskIndex, 1, this.currentRiskEdit);
            this.risks = this.risks;
        } else {
            //third party risk
            const some: RiskModel = {
                ...this.riskThirdPartyForm.value,
                sumInsured: 0,
                premiumRate: 0,
                basicPremium: this.basicPremium,
                loads: this.loads,
                loadingTotal: this.premiumLoadingTotal,
                discountRate: this.premiumDiscountRate,
                premiumLevy: this.basicPremiumLevy,
                netPremium: this.netPremium,
                insuranceType: this.selectedValue.value
            };
            this.selectedRisk = some;

            var riskIndex = _.findIndex(this.risks, {
                id: this.selectedRisk.id
            });
            this.risks.splice(riskIndex, 1, this.currentRiskEdit);
        }

        this.isRiskDetailsEditmode = false;
    }

    closeRiskDetails() {
        this.quoteRiskDetailsModalVisible = false;
    }

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

    getYearOfManfTimeStamp(risk: RiskModel): number {
        return (risk.yearOfManufacture as ITimestamp).seconds * 1000;
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

        const debit$ = '';
        const cert$ = '';

        combineLatest([debit$, cert$]).subscribe(async ([debit, cert]) => {
            this.quote.status = 'Approved';
            await this.quotesService
                .updateMotorQuotation(this.quote, this.quote.id)
                .subscribe(quotation => res => console.log(res));

            // convert to policy
            const policy: Policy = {
                ...this.quoteDetailsForm.value,
                nameOfInsured: this.quoteData.client,
                policyNumber: this.quoteNumber.replace('Q', 'P'),
                dateOfIssue: new Date(),
                expiryDate: this.quoteData.endDate,
                timeOfIssue: new Date(),
                // new Date().getHours() + ':' + new Date().getMinutes(),
                status: 'Active',
                receiptStatus: this.status,
                risks: this.quoteData.risks,
                sumInsured: this.sumArray(this.quoteData.risks, 'sumInsured'),
                netPremium: this.sumArray(this.quoteData.risks, 'netPremium'),
                paymentPlan: this.paymentPlan,
                underwritingYear: new Date(),
                user: localStorage.getItem('user'),
                sourceOfBusiness: this.quoteData.sourceOfBusiness,
                intermediaryName: this.quoteData.intermediaryName
            };

            const debitNote: DebitNote = {
                remarks: '-',
                dateCreated: new Date(),
                dateUpdated: new Date()
            };

            // const policy = this.quoteDetailsForm.value as Policy;
            console.log(policy);
            await this.policiesService.createPolicy(policy).subscribe(res => {
                console.log(res);
                this.policiesService.createDebitNote(res.id, debitNote, res);
            });

            // await this.gqlQuotesService
            //     .addCertificate({
            //         clientId: localStorage.getItem('clientId'), // Added from the policy service
            //         policyNumber: localStorage.getItem('policyNumber'), // Added in the policy service.
            //         certificateUrl: cert.Location
            //     })
            //     .then(res => {
            //         // console.log('GQL', res);
            //         res.subscribe(x => {
            //             console.log('GLQ', x);
            //         });
            //     });

            // await this.gqlQuotesService
            //     .addDebitNote({
            //         clientId: localStorage.getItem('clientId'), // Added from the policy service,
            //         policyNumber: localStorage.getItem('policyNumber'), // Added in the policy service.
            //         debitNoteUrl: debit.Location
            //     })
            //     .then(res => {
            //         res.subscribe(x => {
            //             console.log('GLQ', x);
            //         });
            //         // console.log('GQL', res);
            //     });

            this.isQuoteApproved = true;
            this.approvingQuote = false;
        });
    }

    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }

    // filter by search
    search(value: string): void {
        if (value === '' || !value) {
            this.displayQuote = this.quote;
        }

        this.displayQuote.risks = this.quote.risks.filter(quote => {
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

    // vehicle make loading
    onVehicleMakeSearch(value: string): void {
        this.isVehicleMakeLoading = true;
        this.searchChange$.next(value);
    }

    // vehicle model loading
    onVehicleModelSearch(value: string): void {
        this.isVehicleModelLoading = true;
        this.searchChange$.next(value);
    }

    // import excel fleet methods
    showModal(): void {
        this.isVisible = true;
    }

    handleDownloadTemplate() {
        const headings = [
            [
                'insuranceType',
                'registrationNumber',
                'vehicleMake',
                'vehicleModel',
                'engineNumber',
                'chassisNumber',
                'color',
                'productType',
                'sumInsured',
                'netPremium'
            ]
        ];
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(headings);

        // const element = document.getElementById('risksTemplateTable');
        // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    handleChange({ file, fileList, event, type }: UploadChangeParam): void {
        const status = file.status;

        // when file is uploading
        if (status !== 'uploading') {
            // console.log(file);
            //
        }

        // when file is done uploading
        if (status === 'done') {
            this.msg.success(`${file.name} file uploaded successfully.`);
            this.fileLocation = file.response.Location;
            console.log(this.fileLocation);
            const fileExtension = file.name.split('.')[1];
            this.isVisible = false;

            // get uploaded excel file and convert it to array
            // XMLHttpRequest
            const url = 'assets/docs/risks.xlsx';
            // const url = this.fileLocation;
            const oReq = new XMLHttpRequest();
            oReq.open('GET', this.fileLocation, true);
            oReq.responseType = 'arraybuffer';

            oReq.onload = e => {
                const arraybuffer = oReq.response;

                // //convert data to binary string
                const data = new Uint8Array(arraybuffer);
                const arr = new Array();
                for (let i = 0; i !== data.length; ++i) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                const bstr = arr.join('');

                // call XLSX
                const workbook = XLSX.read(bstr, { type: 'binary' });
                workbook.SheetNames.forEach(sheetName => {
                    const imported_risks: RiskModel[] = XLSX.utils.sheet_to_json(
                        workbook.Sheets[sheetName]
                    );
                    this.risks = imported_risks;
                });
            };

            oReq.send();

            // when there is an error during upload
        } else if (status === 'error') {
            this.msg.error(`${file.name} file upload failed.`);
        }
    }

    // Premium computation methods
    // Basic Premum Computation

    computePremium() {
        this.computePremiumIsLoading = true;
        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: Number(this.premiumDiscount),
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.netPremium = Number(data.totalPremium);
                this.computePremiumIsLoading = false;
            });
    }

    computeThirdPartyPremium() {
        this.computePremiumIsLoading = true;
        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskThirdPartyForm.get('riskStartDate').value,
            quarter: Number(this.riskThirdPartyForm.get('riskQuarter').value),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: Number(this.premiumDiscount),
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.netPremium = Number(data.totalPremium);
                this.computePremiumIsLoading = false;
            });
    }

    // Loading computation
    computeRiotAndStrike() {
        this.computeRiotAndStrikeIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: Number(this.premiumDiscount),
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Riot And Strike',
                    amount: Number(data.riotAndStrikePremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeRiotAndStrikeIsLoading = false;
            });
    }

    computeIncreasedThirdPartyLimit() {
        this.computeIncreasedThirdPartyLimitIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: Number(this.premiumDiscount),
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Increased Third Party Limit',
                    amount: Number(data.thirdPartyLoadingPremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeIncreasedThirdPartyLimitIsLoading = false;
            });
    }

    computeIncreasedThirdPartyLimitThirdParty() {
        this.computeIncreasedThirdPartyLimitIsLoading = true;

        const request: IRateRequest = {
            sumInsured: 0,
            premiumRate: 0,
            startDate: this.riskThirdPartyForm.get('riskStartDate').value,
            quarter: Number(this.riskThirdPartyForm.get('riskQuarter').value),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: Number(this.premiumDiscount),
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Increased Third Party Limit',
                    amount: Number(data.thirdPartyLoadingPremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeIncreasedThirdPartyLimitIsLoading = false;
            });
    }

    computeCarStereo() {
        this.computeCarStereoIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: Number(this.premiumDiscount),
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Car Stereo',
                    amount: Number(data.carStereoPremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeCarStereoIsLoading = false;
            });
    }

    computeTerritorialExtension() {
        this.computeTerritorialExtensionIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: Number(this.premiumDiscount),
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Territorial Extension',
                    amount: Number(data.territorialExtensionPremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeTerritorialExtensionIsLoading = false;
            });
    }

    computeLossOfUse() {
        this.computeLossOfUseIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: Number(this.premiumDiscount),
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Loss Of Use',
                    amount: Number(data.lossOfUsePremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeLossOfUseIsLoading = false;
            });
    }

    // remove load
    removeLoad(i: LoadModel, e: MouseEvent): void {
        e.preventDefault();
        if (this.loads.length > 0) {
            const index = this.loads.indexOf(i);
            this.loads.splice(index, 1);
            this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        }
        this.handleNetPremium();
    }

    removeDiscount(i: DiscountModel, e: MouseEvent): void {
        e.preventDefault();
        if (this.discounts.length > 0) {
            const index = this.discounts.indexOf(i);
            this.discounts.splice(index, 1);
            this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        }
        this.handleNetPremium();
    }

    // Discount Computation
    computeDiscount() {
        this.computeDiscountIsLoading = true;
    }

    // Add risk validation
    validateriskComprehensiveFormDetails(): boolean {
        if (this.riskComprehensiveForm.valid) {
            if (this.sumInsured && this.sumInsured !== 0) {
                if (this.premiumRate && this.premiumRate !== 0) {
                    if (this.netPremium > 0) {
                        return true;
                    }
                }
            }
        }
    }

    handleDiscount(discountType: DiscountType) {
        //following methods check if the repective loads are in the loads array
        const riotAndStrikeInLoads = this.loads.some(
            item => item.loadType === 'Riot And Strike'
        );
        const increaseThirdPartyLimitInLoads = this.loads.some(
            item => item.loadType === 'Increased Third Party Limit'
        );
        const carStereoInLoads = this.loads.some(
            item => item.loadType === 'Car Stereo'
        );
        const territorialExtensionInLoads = this.loads.some(
            item => item.loadType === 'Territorial Extension'
        );
        const lossOfUseInLoads = this.loads.some(
            item => item.loadType === 'Loss Of Use'
        );

        //if the checked loading are not in loads array set there values to Zero!
        if (!riotAndStrikeInLoads) {
            this.riotAndStrikeRate = 0;
        }
        if (!increaseThirdPartyLimitInLoads) {
            this.increasedThirdPartyLimitsRate = 0;
            this.increasedThirdPartyLimitValue = 0;
        }
        if (!carStereoInLoads) {
            this.carStereoValue = 0;
            this.carStereoRate = 0;
        }
        if (!lossOfUseInLoads) {
            this.lossOfUseDailyRate = 0;
            this.lossOfUseDays = 0;
        }

        if (this.premiumDiscountRate != 0) {
            const request: IRateRequest = {
                sumInsured: Number(this.sumInsured),
                premiumRate: Number(this.premiumRate) / 100,
                startDate: this.riskComprehensiveForm.get('riskStartDate')
                    .value,
                quarter: Number(
                    this.riskComprehensiveForm.get('riskQuarter').value
                ),
                appliedDiscount: Number(this.premiumDiscount),
                discount: Number(this.premiumDiscountRate) / 100,
                carStereo: Number(this.carStereoValue),
                carStereoRate: Number(this.carStereoRate) / 100,
                lossOfUseDays: Number(this.lossOfUseDays),
                lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
                territorialExtensionWeeks: Number(
                    this.territorialExtensionWeeks
                ),
                territorialExtensionCountries: Number(
                    this.territorialExtensionCountries
                ),
                thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
                thirdPartyLimitRate:
                    Number(this.increasedThirdPartyLimitsRate) / 100,
                riotAndStrike: Number(this.riotAndStrikeRate) / 100,
                levy: 0.03
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.premiumDiscount = Number(data.discount);
                    this.handleNetPremium();
                });
        }
    }

    handleDiscountThirdParty() {
        //following methods check if the repective loads are in the loads array
        const riotAndStrikeInLoads = this.loads.some(
            item => item.loadType === 'Riot And Strike'
        );
        const increaseThirdPartyLimitInLoads = this.loads.some(
            item => item.loadType === 'Increased Third Party Limit'
        );
        const carStereoInLoads = this.loads.some(
            item => item.loadType === 'Car Stereo'
        );
        const territorialExtensionInLoads = this.loads.some(
            item => item.loadType === 'Territorial Extension'
        );
        const lossOfUseInLoads = this.loads.some(
            item => item.loadType === 'Loss Of Use'
        );

        //if the checked loading are not in loads array set there values to Zero!
        if (!riotAndStrikeInLoads) {
            this.riotAndStrikeRate = 0;
        }
        if (!increaseThirdPartyLimitInLoads) {
            this.increasedThirdPartyLimitsRate = 0;
            this.increasedThirdPartyLimitValue = 0;
        }
        if (!carStereoInLoads) {
            this.carStereoValue = 0;
            this.carStereoRate = 0;
        }
        if (!lossOfUseInLoads) {
            this.lossOfUseDailyRate = 0;
            this.lossOfUseDays = 0;
        }

        if (this.premiumDiscountRate != 0) {
            const request: IRateRequest = {
                sumInsured: Number(this.sumInsured),
                premiumRate: Number(this.premiumRate) / 100,
                startDate: this.riskThirdPartyForm.get('riskStartDate').value,
                quarter: Number(
                    this.riskThirdPartyForm.get('riskQuarter').value
                ),
                discount: Number(this.premiumDiscountRate) / 100,
                appliedDiscount: Number(this.premiumDiscount),
                carStereo: Number(this.carStereoValue),
                carStereoRate: Number(this.carStereoRate) / 100,
                lossOfUseDays: Number(this.lossOfUseDays),
                lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
                territorialExtensionWeeks: Number(
                    this.territorialExtensionWeeks
                ),
                territorialExtensionCountries: Number(
                    this.territorialExtensionCountries
                ),
                thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
                thirdPartyLimitRate:
                    Number(this.increasedThirdPartyLimitsRate) / 100,
                riotAndStrike: Number(this.riotAndStrikeRate) / 100,
                levy: 0.03
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.premiumDiscount = Number(data.discount);
                    this.handleNetPremium();
                });
        }
    }

    handleBasicPremiumCalculationThirdParty(): void {
        if (
            this.riskThirdPartyForm.get('productType').value != '' &&
            this.riskThirdPartyForm.get('riskQuarter').value != ''
        ) {
            if (this.riskThirdPartyForm.get('productType').value == 'Private') {
                if (this.riskThirdPartyForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 165;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 280;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 370;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 464;
                }
            }
            if (
                this.riskThirdPartyForm.get('productType').value == 'Commercial'
            ) {
                if (this.riskThirdPartyForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 199;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 340;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 452;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 566;
                }
            }
            if (
                this.riskThirdPartyForm.get('productType').value == 'Bus/Taxi'
            ) {
                if (this.riskThirdPartyForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 270;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 464;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 618;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 772;
                }
            }
        }

        this.handleNetPremium();
    }

    //following method adds basic premium + loading - discount then applies levy then finds net premium
    handleNetPremium() {
        this.basicPremiumLevy =
            (this.LevyRate / 100) *
            (this.basicPremium +
                this.premiumLoadingTotal -
                this.premiumDiscount);
        this.netPremium =
            this.basicPremium +
            this.premiumLoadingTotal -
            this.premiumDiscount +
            this.basicPremiumLevy;
    }

    //changes the quote basic premium to the inputed amount
    handleBasicPremiumAmount() {
        this.basicPremium = Number(this.basicPremiumAmount);
        this.handleNetPremium();
    }

    //changes the quote increase third party limit to inputed amount
    handleIncreasedThirdPartyLimitAmount() {
        this.loads.push({
            loadType: 'Increased Third Party Limit',
            amount: Number(this.increasedThirdPartyLimitAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    //changes the quote riot and strike to inputed amount
    handleRiotAndStrikeAmount() {
        this.loads.push({
            loadType: 'Riot And Strike',
            amount: Number(this.riotAndStrikeAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    //changes the quote car stereo to inputed amount
    handleCarStereoAmount() {
        this.loads.push({
            loadType: 'Car Stereo',
            amount: Number(this.carStereoAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    //changes the quote loss of use loading to inputed amount
    handleLossOfUseAmount() {
        this.loads.push({
            loadType: 'Loss Of Use',
            amount: Number(this.lossOfUseAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    //changes the quote loss of use loading to inputed amount
    handleTerritorialExtensionAmount() {
        this.loads.push({
            loadType: 'Territorial Extension',
            amount: Number(this.territorialExtensionAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    //changes the quote loss of use loading to inputed amount
    handleInexperiencedDriverAmount() {
        this.loads.push({
            loadType: 'Inexperienced Driver',
            amount: Number(this.inexperiencedDriverAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    //changes the quote loss of use loading to inputed amount
    handleUnderAgeDriverAmount() {
        this.loads.push({
            loadType: 'Under Age Driver',
            amount: Number(this.underAgeDriverAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    //adds inputted discount to total discount amount
    handleNoClaimsDiscountAmount() {
        this.discounts.push({
            discountType: 'No Claims Discount',
            amount: Number(this.noClaimsDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    //adds inputted discount to total discount amount
    handleLoyaltyDiscountAmount() {
        this.discounts.push({
            discountType: 'Loyalty Discount',
            amount: Number(this.loyaltyDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    //adds inputted discount to total discount amount
    handleValuedClientDiscountAmount() {
        this.discounts.push({
            discountType: 'Valued Client Discount',
            amount: Number(this.valuedClientDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    //adds inputted discount to total discount amount
    handleLowTermAgreementDiscountAmount() {
        this.discounts.push({
            discountType: 'Low Term Agreement Discount',
            amount: Number(this.lowTermAgreementDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    ///Draft quotation calculations
    handleDraftQuotation() {
        this.quoteLoadingTotal = 0;
        this.quoteDiscountTotal = 0;
        this.quoteSumInsured = this.sumArray(this.risks, 'sumInsured');
        this.quoteBasicPremium = this.sumArray(this.risks, 'basicPremium');
        this.quoteLevy = this.sumArray(this.risks, 'premiumLevy');
        this.quoteNetPremium = this.sumArray(this.risks, 'netPremium');

        for (let risk of this.risks) {
            this.quoteLoadingTotal += this.sumArray(risk.loads, 'amount');
        }

        for (let risk of this.risks) {
            this.quoteDiscountTotal += this.sumArray(risk.discounts, 'amount');
        }

        this.isViewDraftQuotePDFVisible = true;
    }
}
