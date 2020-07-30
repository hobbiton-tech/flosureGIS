import { Component, OnInit } from '@angular/core';
import {
    MotorQuotationModel,
    RiskModel,
    LoadModel,
    DiscountType,
    DiscountModel,
    LimitsOfLiability,
    Excess,
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
import { combineLatest, BehaviorSubject, Observable, from } from 'rxjs';
import * as XLSX from 'xlsx';
import {
    IIndividualClient,
    ICorporateClient,
} from 'src/app/clients/models/clients.model';
import { UploadChangeParam, NzMessageService } from 'ng-zorro-antd';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import _ from 'lodash';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import {
    IBroker,
    IAgent,
    ISalesRepresentative,
} from 'src/app/settings/components/agents/models/agents.model';
import { ImageElement } from 'canvg';
import { DebitNote, CoverNote } from 'src/app/underwriting/documents/models/documents.model';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import {
    IPolicyClauses,
    IPolicyWording,
    IPolicyExtension,
    IExccess,
} from 'src/app/settings/models/underwriting/clause.model';
import {
    VehicleBodyType,
    MotorComprehensiveLoadingOptions,
    MotorThirdPartyLoadingOptions,
    DiscountOptions,
    SourceOfBusinessOptions,
    ProductTypeOptions,
    InsuranceTypeOptions,
    LimitsOfLiabilityOptions,
} from '../../selection-options';
import moment from 'moment';
import { IReceiptModel } from 'src/app/accounts/components/models/receipts.model';
import { v4 } from 'uuid';
import { AccountService } from 'src/app/accounts/services/account.service';
import { ReceiptTypesService } from 'src/app/settings/components/finance-setups/services/receipt-types.service';
import { IReceiptTypes } from 'src/app/settings/models/finance/receipt-types.model';
import { IPaymentMethod } from 'src/app/settings/models/finance/payment-methodes.model';
import { PaymentMethodService } from 'src/app/settings/components/finance-setups/services/payment-method.service'


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
    styleUrls: ['./quote-details.component.scss'],

})
export class QuoteDetailsComponent implements OnInit {
    vehicleBodyType = VehicleBodyType;
    motorComprehensiveloadingOptions = MotorComprehensiveLoadingOptions;
    motorThirdPartyloadingOptions = MotorThirdPartyLoadingOptions;
    discountOptions = DiscountOptions;
    sourceOfBusinessOptions = SourceOfBusinessOptions;
    productTypeOptions = ProductTypeOptions;
    insuranceTypeOptions = InsuranceTypeOptions;
    limitsTypeOptions = LimitsOfLiabilityOptions;



    receiptTypeList: IReceiptTypes[] = [];
    //   receiptTypeId: string | null = null;

    paymentMethodList: IPaymentMethod[] = [];

    cheque = false;
    Type_name: any;
    Method_name: any;

    private header = new HttpHeaders({
        'content-type': 'application/json',
        Authorization: 'Douglas.Chilungu:aplusgeneral@2019',
    });
    clauses: IPolicyClauses[];
    wordings: IPolicyWording[];
    extensions: IPolicyExtension[];
    // form
    quoteDetailsForm: FormGroup;
    riskThirdPartyForm: FormGroup;
    riskComprehensiveForm: FormGroup;
    limitsOfLiabilityForm: FormGroup;
    excessesForm: FormGroup;
    combinedLimitsForm: FormGroup;
    clients: Array<IIndividualClient & ICorporateClient>;

    // intermediaries
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

    // set risk tamplate table not vivible
    isTabletemplate = true;

    // excel template data
    data: AOA = [
        [1, 2],
        [3, 4],
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

    LevyRate = 3;

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

    lossOfKeysAmount: number;
    maliciousDamageAmount: number;
    medicalExpensesAmount: number;
    injuryAndDeathAmount: number;
    propertyDamageAmount: number;
    earthquakeAmount: number;
    explosionsAmount: number;
    financialLossAmount: number;
    fireAndAlliedPerilsAmount: number;
    legalExpensesAmount: number;
    landslideAmount: number;
    passengerLiabilityAmount: number;
    permanentDisabilityAmount: number;

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

    // dicounts added
    discounts: DiscountModel[] = [];

    // limits of liability
    limitsOfLiability: LimitsOfLiability[] = [];

    // excesses
    excesses: Excess[] = [];

    // for quote document
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

    // selected basic premium input type option are rate and amount
    selectedBasicPremiunTypeValue = 'rate';
    // basic premium amount when user selects amount as basic premium input type
    basicPremiumAmount: number;

    selectedPaymentMethodValue = 'cheque';

    // $scope.selectedPaymentMethod = "cheque";

    // selected increase third party input type
    selectedIncreaseThirdPartyLimitInputTypeValue = 'rate';
    // increase third party amount
    increasedThirdPartyLimitAmount: number;

    // selected riot and strike input type
    selectedRiotAndStrikeInputTypeValue = 'rate';
    // increase third party amount
    riotAndStrikeAmount: number;

    // selected Car stereo input type
    selectedCarStereoInputTypeValue = 'rate';
    // car stereo amount
    carStereoAmount: number;

    // selected loss of use input type
    selectedLossOfUseInputTypeValue = 'rate';
    // car stereo amount
    lossOfUseAmount: number;

    // selected territorial extension input type
    selectedTerritorialExtensionInputTypeValue = 'rate';
    // loss of use amount
    territorialExtensionAmount: number;

    // inexperienced driver amount
    inexperiencedDriverAmount: number;

    // under age driver amount
    underAgeDriverAmount: number;

    // selected no claim discount input type
    selectedNoClaimsDiscountInputTypeValue = 'rate';
    // no claim discount amount
    noClaimsDiscountAmount: number;

    // selected loyalty discount input type
    selectedLoyaltyDiscountInputTypeValue = 'rate';
    // loyalty discount amount
    loyaltyDiscountAmount: number;

    // selected valued client discount input type
    selectedValuedClientDiscountInputTypeValue = 'rate';
    // valued client discount amount
    valuedClientDiscountAmount: number;

    // selected low term agreement discount input type
    selectedLowTermAgreementDiscountInputTypeValue = 'rate';
    // low term agreement discount amount
    lowTermAgreementDiscountAmount: number;

    // standard limits
    defaultDeathAndInjuryPerPersonMax = 30100;
    defaultDeathAndInjuryPerEventMax = 60100;
    defaultPropertyDamageMax = 30000;
    defaultCombinedLimitsMax =
        this.defaultDeathAndInjuryPerPersonMax +
        this.defaultDeathAndInjuryPerEventMax +
        this.defaultPropertyDamageMax;

    // standard limits rates
    defaultDeathAndInjuryPerPersonRate = 0;
    defaultDeathAndInjuryPerEventRate = 0;
    defaultPropertyDamageRate = 0;
    defaultCombinedLimitsRate = 0;

    // limits
    deathAndInjuryPerPersonMax = this.defaultDeathAndInjuryPerPersonMax;
    deathAndInjuryPerEventMax = this.defaultDeathAndInjuryPerEventMax;
    propertyDamageMax = this.defaultPropertyDamageMax;
    combinedLimitsMax =
        this.deathAndInjuryPerPersonMax +
        this.deathAndInjuryPerEventMax +
        this.propertyDamageMax;

    deathAndInjuryPerPerson = this.defaultDeathAndInjuryPerPersonMax;
    deathAndInjuryPerEvent = this.defaultDeathAndInjuryPerEventMax;
    propertyDamage = this.defaultPropertyDamageMax;
    combinedLimits =
        this.deathAndInjuryPerPerson +
        this.deathAndInjuryPerEvent +
        this.propertyDamage;

    deathAndInjuryPerPersonPremium = 0;
    deathAndInjuryPerEventPremium = 0;
    propertyDamagePremium = 0;
    combinedLimitsPremium = 0;
    limitsTotalPremium =
        this.deathAndInjuryPerPersonPremium +
        this.deathAndInjuryPerEventPremium +
        this.propertyDamagePremium +
        this.combinedLimitsPremium;

    deathAndInjuryPerPersonRate = this.defaultDeathAndInjuryPerPersonRate;
    deathAndInjuryPerEventRate = this.defaultDeathAndInjuryPerEventRate;
    propertyDamageRate = this.defaultPropertyDamageRate;
    combinedLimitsRate = this.defaultCombinedLimitsRate;

    optionList = [
        { label: 'Motor Comprehensive', value: 'Comprehensive' },
        { label: 'Motor Third Party', value: 'ThirdParty' },
    ];
    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    selectedLimits = { label: 'Standard', value: 'standardLimits' };

    selectedLoadingValue = {
        label: '',
        value: '',
    };

    selectedDiscountValue = { label: '', value: '' };

    selectedSourceOfBusiness: string;

    quoteData: MotorQuotationModel = new MotorQuotationModel();

    isQuoteApproved = false;
    approvingQuote = false;

    // quoteNumber
    quoteNumber: string;
    quote: MotorQuotationModel = new MotorQuotationModel();
    displayQuote: MotorQuotationModel;

    // source of business details
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
    policiesCount: number;
    getInsuranceType = '';
    selectedPlan = 'fully';
    isPlanVisible = false;
    isConfirmReceiptLoading = false;
    isFullPayment = false;
    receiptForm: FormGroup;
    paymentPlanForm: FormGroup;
    // optionTypeOfReceiptList = [
    //     { label: 'Premium Payment', value: 'Premium Payment' },
    //     { label: 'Third Party Recovery', value: 'Third Party Recovery' },
    //     {
    //         label: 'Imprest Retirement Receipt',
    //         value: 'Imprest Retirement Receipt',
    //     },
    //     { label: 'Third Party Recovery', value: 'Third Party Recovery' },
    //     { label: 'General Receipt', value: 'General Receipt' },
    // ];

    // paymentMethodList = [
    //     { label: 'Cash', value: 'cash' },
    //     { label: 'EFT', value: 'eft' },
    //     { label: 'Bank Transfer', value: 'bank transfer' },
    //     { label: 'Cheque', value: 'cheque' },
    // ];
    paymentMethod: any;
    submitted = false;
    _id = '';
    receiptNum: string;
    isOkLoading = false;
    amount = '';
    policyId: string;
    newRisks: RiskModel[];
    //Excess Variable
    excessList: Excess[] = [];

    excessTHP: IExccess[] = [];
    excessAct: IExccess[] = [];
    excessFT: IExccess[] = [];
    limitsOfLiabilities: LimitsOfLiability[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private router: Router,
        private quotesService: QuotesService,
        private readonly clientsService: ClientsService,
        private route: ActivatedRoute,
        private msg: NzMessageService,
        private http: HttpClient,
        private readonly agentsService: AgentsService,
        private productClauseService: ClausesService,
        private receiptService: AccountService,
        private message: NzMessageService,
        private ReceiptTypeService: ReceiptTypesService,
        private PaymentMethodService: PaymentMethodService,
    ) {
        this.receiptForm = this.formBuilder.group({
            receivedFrom: ['', Validators.required],
            sumInDigits: [''],
            paymentMethod: ['', Validators.required],
            tpinNumber: ['4324324324324324'],
            address: [''],
            receiptType: ['', Validators.required],
            narration: ['', Validators.required],
            sumInWords: [''],
            dateReceived: [''],
            todayDate: [''],
            remarks: [''],
            cheqNumber: [''],
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe((param) => {
            this.quoteNumber = param.quoteNumber;
            this.quotesService.getMotorQuotations().subscribe((quotes) => {
                this.quoteData = quotes.filter(
                    (x) => x.quoteNumber === this.quoteNumber
                )[0];
                this.quotesList = quotes;
                this.quote = this.quotesList.filter(
                    (x) => x.quoteNumber === this.quoteNumber
                )[0];
                console.log('this.quote>>>>>', this.quoteData);

                this.risks = this.quoteData.risks;

                this.excessList = this.risks[0].excesses

                this.limitsOfLiabilities = this.risks[0].limitsOfLiability
                console.log('RISKS<<<<<<', this.excessList)

                // this.productClauseService.getExccesses().subscribe((res) => {
                //     this.excessList = res;
                //     this.excessTHP = res.filter((x) => x.productId === 'c40dcacc-b3fa-43fb-bb13-ac1e24bd657d');
                //     this.excessAct = res.filter((x) => x.productId === 'c40dcacc-b3fa-43fb-bb13-ac1e24bd657d');
                //     this.excessFT = res.filter((x) => x.productId === 'c40dcacc-b3fa-43fb-bb13-ac1e24bd657d');

                // })



                //////////////////////////////////
                /////////// RECEIPT ///////////////
                ////////////////////////////////
                this.ReceiptTypeService.getReceiptTypes().subscribe((res) => {
                    this.receiptTypeList = res;
                });

                ///////////////////////////////////
                ///////// PAYMENT ////////////////////
                /////////////////////////////////////////
                this.PaymentMethodService.getPaymentMethods().subscribe((res) => {
                    this.paymentMethodList = res;
                });
                this.productClauseService
                    .getPolicyClauses()
                    .subscribe((res) => {
                        this.clauses = res.filter(
                            (x) => x.policyId === this.risks[0].id
                        );
                        console.log('CLAUSES>>>>>', this.clauses);
                    });

                this.productClauseService
                    .getPolicyExtensions()
                    .subscribe((res) => {
                        this.extensions = res.filter(
                            (x) => x.policyId === this.risks[0].id
                        );
                        console.log('EXTENSIONS>>>>>', this.extensions);
                    });

                this.productClauseService
                    .getPolicyWordings()
                    .subscribe((res) => {
                        this.wordings = res.filter(
                            (x) => x.policyId === this.risks[0].id
                        );
                        console.log('WORDINGS>>>>>', this.wordings);
                    });

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
                this.amount = this.sumArray(this.quoteData.risks, 'netPremium');

                // this.receiptForm
                // .get('sumInDigits')
                // .setValue(this.sumArray(this.quoteData.risks, 'netPremium'));

                // this.receiptForm
                //     .get('currency')
                //     .setValue(this.quoteData.currency);
                // this.receiptForm
                //     .get('sourceOfBusiness')
                //     .setValue(this.quoteData.sourceOfBusiness, {
                //         onlySelf: true,
                //     });
                // this.receiptForm
                //     .get('intermediaryName')
                //     .setValue(this.quoteData.intermediaryName);

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
                        onlySelf: true,
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

            this.clientsService.getAllClients().subscribe((clients) => {
                this.clients = [...clients[0], ...clients[1]] as Array<
                    IIndividualClient & ICorporateClient
                >;
            });

            this.agentsService.getAgents().subscribe((agents) => {
                this.agents = agents;
            });

            this.agentsService.getBrokers().subscribe((brokers) => {
                this.brokers = brokers;
            });

            this.agentsService
                .getSalesRepresentatives()
                .subscribe((salesRepresentatives) => {
                    this.salesRepresentatives = salesRepresentatives;
                });

            this.agentsService
                .getAllIntermediaries()
                .subscribe((intermediaries) => {
                    this.intermediaries = [
                        ...intermediaries[0],
                        ...intermediaries[1],
                        ...intermediaries[2],
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
                intermediaryName: ['', Validators.required],
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
                cubicCapacity: ['', Validators.required],
                seatingCapacity: ['', Validators.required],
                bodyType: ['', Validators.required],
                productType: ['', Validators.required],
                insuranceType: ['Comprehensive'],
                numberOfDays: ['', Validators.required],
                expiryQuarter: ['', Validators.required],
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
                cubicCapacity: ['', Validators.required],
                seatingCapacity: ['', Validators.required],
                bodyType: ['', Validators.required],
                productType: ['', [Validators.required]],
                insuranceType: [this.selectedValue.value],
                numberOfDays: ['', Validators.required],
                expiryQuarter: ['', Validators.required],
            });

            this.limitsOfLiabilityForm = this.formBuilder.group({
                deathAndInjuryPerPerson: ['', Validators.required],
                deathAndInjuryPerEvent: ['', Validators.required],
                propertyDamage: ['', Validators.required],
                deathAndInjuryPerPersonPremium: ['', Validators.required],
                deathAndInjuryPerEventPremium: ['', Validators.required],
                propertyDamagePremium: ['', Validators.required],
                deathAndInjuryPerPersonRate: ['', Validators.required],
                deathAndInjuryPerEventRate: ['', Validators.required],
                propertyDamageRate: ['', Validators.required],
                // protectionAndRemoval: ['', Validators.required],
                // deathBodilyInjuryPerEvent: ['', Validators.required],
                // deathBodilyInjuryPerPerson: ['', Validators.required],
                // propertyDamage: ['', Validators.required],
                // medicalExpensesPerAccident: ['', Validators.required],
                // medicalExpensesPerPerson: ['', Validators.required],
                // unauthourizedRepair: ['', Validators.required]
            });

            this.excessesForm = this.formBuilder.group({
                collisionAndFire: ['', Validators.required],
                theftOfVehicleWithAntiTheftDevice: ['', Validators.required],
                theftOfVehicleWithoutAntiTheftDevice: ['', Validators.required],
                thirdPartyPropertyDamage: ['', Validators.required],
            });

            this.combinedLimitsForm = this.formBuilder.group({
                combinedLimits: ['', Validators.required],
                combinedLimitsPremium: ['', Validators.required],
                combinedLimitsRate: ['', Validators.required],
            });

            // set values for limits of liability
            this.limitsOfLiabilityForm
                .get('protectionAndRemoval')
                .setValue('500');
            this.limitsOfLiabilityForm
                .get('deathBodilyInjuryPerEvent')
                .setValue('60100');
            this.limitsOfLiabilityForm
                .get('deathBodilyInjuryPerPerson')
                .setValue('30100');
            this.limitsOfLiabilityForm.get('propertyDamage').setValue('30000');
            this.limitsOfLiabilityForm
                .get('medicalExpensesPerAccident')
                .setValue('100');
            this.limitsOfLiabilityForm
                .get('medicalExpensesPerPerson')
                .setValue('50');
            this.limitsOfLiabilityForm
                .get('unauthourizedRepair')
                .setValue('500');

            // set values for excesses
            this.excessesForm.get('collisionAndFire').setValue('500');
            this.excessesForm
                .get('theftOfVehicleWithAntiTheftDevice')
                .setValue('500');
            this.excessesForm
                .get('theftOfVehicleWithoutAntiTheftDevice')
                .setValue('500');
            this.excessesForm.get('thirdPartyPropertyDamage').setValue('500');

            this.policiesService.getPolicies().subscribe((policies) => {
                this.policiesCount = policies.length;
            });
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

        const vehicleMakeOptionList$: Observable<
            string[]
        > = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getVehicleMakeList));
        vehicleMakeOptionList$.subscribe((data) => {
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

        const vehicleModelOptionList$: Observable<
            string[]
        > = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getVehicleModelList));
        vehicleModelOptionList$.subscribe((data) => {
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
                levy: 0,
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe((data) => {
                    const doo = new Date(data.endDate);
                    const nd = new Date(
                        doo.getTime() - doo.getTimezoneOffset() * -60000
                    );

                    const startDate = moment(
                        this.riskComprehensiveForm.get('riskStartDate').value
                    );
                    const endDate = moment(nd);
                    const numberOfDays = endDate.diff(startDate, 'days');
                    const expiryQuarter = moment(endDate).quarter();
                    const expiryYear = moment(endDate)
                        .year()
                        .toString()
                        .slice(-2);

                    this.riskComprehensiveForm.get('riskEndDate').setValue(nd);

                    this.riskComprehensiveForm
                        .get('numberOfDays')
                        .setValue(numberOfDays);

                    this.riskComprehensiveForm
                        .get('expiryQuarter')
                        .setValue(expiryQuarter + '/' + expiryYear);
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
                levy: 0,
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe((data) => {
                    const doo = new Date(data.endDate);
                    const nd = new Date(
                        doo.getTime() - doo.getTimezoneOffset() * -60000
                    );

                    this.riskThirdPartyForm.get('riskEndDate').setValue(nd);
                });
        }
    }

    handleDatesCalculation(): void {
        if (this.selectedValue.value == 'Comprehensive') {
            const startDate = moment(
                this.riskComprehensiveForm.get('riskStartDate').value
            );
            const endDate = moment(
                this.riskComprehensiveForm.get('riskEndDate').value
            );

            const numberOfDays = endDate.diff(startDate, 'days');
            const expiryQuarter = moment(endDate).quarter();
            const expiryYear = moment(endDate).year().toString().slice(-2);

            this.riskComprehensiveForm
                .get('numberOfDays')
                .setValue(numberOfDays);

            this.riskComprehensiveForm
                .get('expiryQuarter')
                .setValue(expiryQuarter + '/' + expiryYear);
        } else {
            const startDate = moment(
                this.riskThirdPartyForm.get('riskStartDate').value
            );
            const endDate = moment(
                this.riskThirdPartyForm.get('riskEndDate').value
            );

            const numberOfDays = endDate.diff(startDate, 'days');
            const expiryQuarter = moment(endDate).quarter();
            const expiryYear = moment(endDate).year().toString().slice(-2);

            this.riskThirdPartyForm.get('numberOfDays').setValue(numberOfDays);

            this.riskThirdPartyForm
                .get('expiryQuarter')
                .setValue(expiryQuarter + '/' + expiryYear);
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
                levy: 0,
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe((data) => {
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
                levy: 0,
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe((data) => {
                    this.basicPremium = Number(data.basicPremium);
                    this.handleNetPremium();
                });
        }
    }

    addThirdPartyRisk(): void {
        this.addLimitsOfLiability();
        this.addExcesses();

        const some: RiskModel[] = [];
        some.push({
            ...this.riskThirdPartyForm.value,
            sumInsured: this.sumInsured,
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            limitsOfLiability: this.limitsOfLiability,
            excesses: this.excesses,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: 0.03,
            netPremium: this.netPremium,
            insuranceType: this.selectedValue.value,
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
        this.addLimitsOfLiability();
        this.addExcesses();

        const some: RiskModel[] = [];
        some.push({
            ...this.riskComprehensiveForm.value,
            sumInsured: this.sumInsured,
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            limitsOfLiability: this.limitsOfLiability,
            excesses: this.excesses,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: 0.03,
            netPremium: this.netPremium,
            insuranceType: this.selectedValue.value,
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
                .setValue(risk.yearOfManufacture);
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
            this.riskComprehensiveForm
                .get('cubicCapacity')
                .setValue(risk.cubicCapacity);
            this.riskComprehensiveForm
                .get('seatingCapacity')
                .setValue(risk.seatingCapacity);
            this.riskComprehensiveForm.get('bodyType').setValue(risk.bodyType);
            this.riskComprehensiveForm
                .get('numberOfDays')
                .setValue(risk.numberOfDays);
            this.riskComprehensiveForm
                .get('expiryQuarter')
                .setValue(risk.expiryQuarter);
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
            this.riskThirdPartyForm
                .get('cubicCapacity')
                .setValue(risk.cubicCapacity);
            this.riskThirdPartyForm
                .get('seatingCapacity')
                .setValue(risk.seatingCapacity);
            this.riskThirdPartyForm.get('bodyType').setValue(risk.bodyType);
            this.riskThirdPartyForm
                .get('numberOfDays')
                .setValue(risk.numberOfDays);
            this.riskThirdPartyForm
                .get('expiryQuarter')
                .setValue(risk.expiryQuarter);
        }

        this.deathAndInjuryPerPerson = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'deathAndInjuryPerPerson'
        )[0].amount;
        this.deathAndInjuryPerEvent = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'deathAndInjuryPerEvent'
        )[0].amount;
        this.propertyDamage = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'propertyDamage'
        )[0].amount;
        this.combinedLimits = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'combinedLimits'
        )[0].amount;

        this.deathAndInjuryPerPersonRate = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'deathAndInjuryPerPerson'
        )[0].rate;
        this.deathAndInjuryPerEventRate = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'deathAndInjuryPerEvent'
        )[0].rate;
        this.propertyDamageRate = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'propertyDamage'
        )[0].rate;
        this.combinedLimitsRate = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'combinedLimits'
        )[0].rate;

        this.deathAndInjuryPerPersonPremium = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'deathAndInjuryPerPerson'
        )[0].premium;
        this.deathAndInjuryPerEventPremium = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'deathAndInjuryPerEvent'
        )[0].premium;
        this.propertyDamagePremium = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'propertyDamage'
        )[0].premium;
        this.combinedLimitsPremium = risk.limitsOfLiability.filter(
            (x) => x.liabilityType === 'combinedLimits'
        )[0].premium;

        this.excessesForm
            .get('below21Years')
            .setValue(
                risk.excesses.filter((x) => x.excessType == 'below21Years')[0]
                    .amount
            );
        this.excessesForm
            .get('over70Years')
            .setValue(
                risk.excesses.filter((x) => x.excessType == 'over70Years')[0]
                    .amount
            );
        this.excessesForm
            .get('noLicence')
            .setValue(
                risk.excesses.filter((x) => x.excessType == 'noLicence')[0]
                    .amount
            );
        this.excessesForm
            .get('careLessDriving')
            .setValue(
                risk.excesses.filter(
                    (x) => x.excessType == 'careLessDriving'
                )[0].amount
            );

        this.excessesForm
            .get('otherEndorsement')
            .setValue(
                risk.excesses.filter(
                    (x) => x.excessType == 'otherEndorsement'
                )[0].amount
            );

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
        this.risks = this.risks.filter((risk) => risk.regNumber !== regNumber);
    }

    // save risks changes after editing
    saveRisk(): void {
        this.currentRiskEdit = this.selectedRisk;
        console.log(this.currentRiskEdit);

        if (this.selectedValue.value === 'Comprehensive') {
            // comprehensive risk
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
                insuranceType: this.selectedValue.value,
            };
            this.currentRiskEdit = some;

            const riskIndex = _.findIndex(this.risks, {
                id: this.selectedRisk.id,
            });
            this.risks.splice(riskIndex, 1, this.currentRiskEdit);
            this.risks = this.risks;
        } else {
            // third party risk
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
                insuranceType: this.selectedValue.value,
            };
            this.selectedRisk = some;

            const riskIndex = _.findIndex(this.risks, {
                id: this.selectedRisk.id,
            });
            this.risks.splice(riskIndex, 1, this.currentRiskEdit);
        }

        this.isRiskDetailsEditmode = false;
    }

    closeRiskDetails() {
        this.quoteRiskDetailsModalVisible = false;
    }

    handleOk(): void {
        // this.isConfirmLoading = true;
        // setTimeout(() => {
        //     this.isVisible = false;
        //     this.isConfirmLoading = false;
        //     this.router.navigateByUrl('/flosure/underwriting/policies');
        // }, 3000);

        console.log(this.quoteDetailsForm.value);
        // push to convert quote to policy and policies collection
        const policy = this.quoteDetailsForm.value as Policy;

        for (const clause of this.clauses) {
            clause.policyId = policy.id;
            this.productClauseService.updatePolicyClause(clause);
        }

        for (const extenstion of this.extensions) {
            extenstion.policyId = policy.id;
            this.productClauseService.updatePolicyExtension(extenstion);
        }

        for (const wording of this.wordings) {
            wording.policyId = policy.id;
            this.productClauseService.updatePolicyWording(wording);
        }

        console.log(
            'CLAUSE>>>>>>',
            this.clauses,
            this.extensions,
            this.wordings
        );

        this.policiesService.addPolicy(policy);
        this.isVisible = false;
        this.router.navigateByUrl('/flosure/underwriting/policies');
        this.isConfirmLoading = false;
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

    // getYearOfManfTimeStamp(risk: RiskModel): number {
    //     return (risk.yearOfManufacture as ITimestamp).seconds * 1000;
    // }

    getEndDateTimeStamp(quote: MotorQuotationModel): number {
        if (!this.quotesLoading) {
            return (quote.endDate as ITimestamp).seconds;
        }
    }

    handleCancel(): void {
        this.isVisible = false;
    }
    handleReceiptCancel() {
        this.isPlanVisible = false;
    }

    handleReceiptOk() { }
    showPaymentModal() {
        this.isPlanVisible = true;
    }
    generateDocuments(): void {
        console.log('here>>>>>', this.quote.risks[0].insuranceType);
        this.amount = this.sumArray(this.quoteData.risks, 'netPremium');
        this.approvingQuote = true;

        if (
            this.quote.risks[0].insuranceType === 'ThirdPartyFireAndTheft' ||
            'ThirdParty' ||
            'ActOnly'
        ) {
            this.getInsuranceType = this.quote.risks[0].insuranceType;

            this.submitted = true;
            // console.log('DEBIT NOTE NUMBER>>>>>', this.debitnote.debitNoteNumber);
            if (this.receiptForm.valid) {
                this.isOkLoading = true;
                this._id = v4();
                const receipt: IReceiptModel = {
                    id: this._id,
                    ...this.receiptForm.value,
                    onBehalfOf: this.quoteData.client,
                    capturedBy: localStorage.getItem('user'),
                    sumInDigits: this.amount,
                    // policyNumber: this.policyNumber,
                    receiptStatus: 'Receipted',
                    todayDate: new Date(),
                    // invoiceNumber: this.debitnote.debitNoteNumber,
                    sourceOfBusiness: this.quoteData.sourceOfBusiness,
                    intermediaryName: this.quoteData.intermediaryName,
                    currency: this.quoteData.currency,
                };

                this.receiptNum = this._id;

                // combineLatest().subscribe(async ([debit, cert]) => {
                this.quote.status = 'Approved';
                this.quotesService
                    .updateMotorQuotation(this.quote, this.quote.id)
                    .subscribe((quotation) => (res) => console.log(res));

                // convert to policy
                const policy: Policy = {
                    ...this.quoteDetailsForm.value,
                    nameOfInsured: this.quoteData.client,
                    clientCode: this.quoteData.clientCode,
                    policyNumber: this.quoteNumber.replace('Q', 'P'),
                    dateOfIssue: new Date(),
                    expiryDate: this.quoteData.endDate,
                    timeOfIssue: new Date(),
                    // new Date().getHours() + ':' + new Date().getMinutes(),
                    status: 'Active',
                    receiptStatus: 'Receipted',
                    risks: this.quoteData.risks,
                    sumInsured: this.sumArray(
                        this.quoteData.risks,
                        'sumInsured'
                    ),
                    netPremium: this.sumArray(
                        this.quoteData.risks,
                        'netPremium'
                    ),
                    paymentPlan: 'Created',
                    underwritingYear: new Date(),
                    user: localStorage.getItem('user'),
                    sourceOfBusiness: this.quoteData.sourceOfBusiness,
                    intermediaryName: this.quoteData.intermediaryName,
                };

                const debitNote: DebitNote = {
                    remarks: '-',
                    dateCreated: new Date(),
                    dateUpdated: new Date(),
                };

                const coverNote: CoverNote = {
                    dateCreated: new Date(),
                    dateUpdated: new Date()
                }

                // const policy = this.quoteDetailsForm.value as Policy;
                console.log(policy);

                this.policiesService.createPolicy(policy).subscribe((res) => {
                    console.log('response:', res);

                    this.policyId = res.id;
                    this.newRisks = res.risks;
                    console.log('Risks>>>>>>>>', this.newRisks);


                    // this.policiesService.createDebitNote(
                    //     res.id,
                    //     debitNote,
                    //     res,
                    //     this.policiesCount
                    // );

                    let insuranceType = '';
                    const productType = this.getInsuranceType;
                    if (productType == 'Comprehensive') {
                        insuranceType = 'MCP';
                    } else {
                        insuranceType = 'THP';
                    }

                    for (const r of this.newRisks) {

                        let insuranceType = '';
                        const productType = r.insuranceType;
                        if (productType == 'Comprehensive') {
                            insuranceType = 'MCP';
                        } else {
                            insuranceType = 'THP';
                        }

                        this.http
                            .get<any>(
                                `https://flosure-number-generation.herokuapp.com/aplus-certificate-number/1/0/${insuranceType}`
                            )
                            .subscribe(async (res) => {
                                coverNote.certificateNumber = res.data.certificate_number;
                                coverNote.policyId = r.id;
                                console.log(
                                    'Cover Note>>>>',
                                    res.data.certificate_number, coverNote
                                );

                                this.http
                                    .post<CoverNote>(
                                        `https://www.flosure-api.com/documents/cover-note`,
                                        coverNote
                                    )
                                    .subscribe(
                                        async (res) => {
                                            console.log("CHECK for RESULTS<<<<<<<", res);
                                        },
                                        async (err) => {
                                            console.log("CHECK for ERRORS<<<<<<<", err);
                                        }
                                    );

                            });

                    }


                    this.http
                        .get<any>(
                            `https://flosure-number-generation.herokuapp.com/aplus-invoice-number/1/0/${insuranceType}`
                        )
                        .subscribe(async (res) => {
                            debitNote.debitNoteNumber = res.data.invoice_number;

                            console.log(
                                'DEBITNOTE>>>>',
                                res.data.invoice_number
                            );

                            this.http
                                .post<DebitNote>(
                                    `https://www.flosure-api.com/documents/debit-note/${this.policyId}`,
                                    debitNote
                                )
                                .subscribe(
                                    async (res) => {
                                        console.log(res);
                                    },
                                    async (err) => {
                                        console.log(err);
                                    }
                                );

                            receipt.invoiceNumber = res.data.invoice_number;
                            this.receiptService
                                .addReceipt(
                                    receipt,
                                    this.quote.risks[0].insuranceType
                                )
                                .then((mess) => {
                                    this.message.success(
                                        'Receipt Successfully created'
                                    );

                                    console.log(mess);
                                })
                                .catch((err) => {
                                    this.message.warning('Receipt Failed');
                                    console.log(err);
                                });
                        });

                    for (const clause of this.clauses) {
                        clause.policyId = res.id;
                        this.productClauseService.updatePolicyClause(clause);
                    }

                    for (const extenstion of this.extensions) {
                        extenstion.policyId = res.id;
                        this.productClauseService.updatePolicyExtension(
                            extenstion
                        );
                    }

                    for (const wording of this.wordings) {
                        wording.policyId = res.id;
                        this.productClauseService.updatePolicyWording(wording);
                    }

                    console.log(
                        'CLAUSE>>>>>>',
                        this.clauses,
                        this.extensions,
                        this.wordings
                    );

                    for (const risk of policy.risks) {
                        console.log('Risks>>>>', risk);

                        if (
                            risk.insuranceType === 'ThirdParty' ||
                            'ActOnly' ||
                            'ThirdPartyFireAndTheft'
                        ) {
                            const params = {
                                insuranceType: 1,
                                status: 1,
                                registrationMark: risk.regNumber.replace(
                                    /\s/g,
                                    ''
                                ),
                                dateFrom: risk.riskStartDate,
                                dateTo: risk.riskEndDate,
                                insurancePolicyNo: policy.policyNumber,
                                chassisNumber: risk.chassisNumber,
                            };

                            console.log('PARAMS>>>>>>', params);

                            // this.quotesService.postRtsa(params);
                        } else if (risk.insuranceType === 'Comprehensive') {
                            const params = {
                                insuranceType: 2,
                                status: 1,
                                registrationMark: risk.regNumber.replace(
                                    /\s/g,
                                    ''
                                ),
                                dateFrom: risk.riskStartDate,
                                dateTo: risk.riskEndDate,
                                insurancePolicyNo: policy.policyNumber,
                                chassisNumber: risk.chassisNumber,
                            };
                            console.log('PARAMS>>>>>>', params);

                            // this.quotesService.postRtsa(params);

                            console.log(
                                'Risk Type>>>>',
                                risk.insuranceType,
                                policy.policyNumber
                            );
                        }
                    }
                });

                this.isQuoteApproved = true;
                this.approvingQuote = false;
                // });

                this.receiptForm.reset();
                setTimeout(() => {
                    this.isVisible = false;
                    this.isOkLoading = false;
                }, 3000);

                this.generateID(this._id);
            }
            console.log('HOOOOORAY>>>>>>', this.getInsuranceType);
        } else if (this.quote.risks[0].insuranceType === 'Comprehensive') {
            this.getInsuranceType = this.quote.risks[0].insuranceType;

            this.submitted = true;
            // console.log('DEBIT NOTE NUMBER>>>>>', this.debitnote.debitNoteNumber);
            if (this.receiptForm.valid) {
                this.isOkLoading = true;
                this._id = v4();
                const receipt: IReceiptModel = {
                    id: this._id,
                    ...this.receiptForm.value,
                    onBehalfOf: this.quoteData.client,
                    capturedBy: localStorage.getItem('user'),
                    // policyNumber: this.policyNumber,
                    receiptStatus: 'Receipted',
                    todayDate: new Date(),
                    // invoiceNumber: this.debitnote.debitNoteNumber,
                    sourceOfBusiness: this.quoteData.sourceOfBusiness,
                    intermediaryName: this.quoteData.intermediaryName,
                    currency: this.quoteData.currency,
                };

                this.receiptNum = this._id;
                console.log('Receipt>>>>', receipt);

                // combineLatest().subscribe(async ([debit, cert]) => {
                this.quote.status = 'Approved';
                this.quotesService
                    .updateMotorQuotation(this.quote, this.quote.id)
                    .subscribe((quotation) => (res) => console.log(res));

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
                    receiptStatus: 'Receipted',
                    risks: this.quoteData.risks,
                    sumInsured: this.sumArray(
                        this.quoteData.risks,
                        'sumInsured'
                    ),
                    netPremium: this.sumArray(
                        this.quoteData.risks,
                        'netPremium'
                    ),
                    paymentPlan: 'Created',
                    underwritingYear: new Date(),
                    user: localStorage.getItem('user'),
                    sourceOfBusiness: this.quoteData.sourceOfBusiness,
                    intermediaryName: this.quoteData.intermediaryName,
                };

                const debitNote: DebitNote = {
                    remarks: '-',
                    dateCreated: new Date(),
                    dateUpdated: new Date(),
                };

                // const policy = this.quoteDetailsForm.value as Policy;
                console.log(policy);

                this.policiesService.createPolicy(policy).subscribe((res) => {
                    console.log('response:', res);
                    this.policyId = res.id;

                    // this.policiesService.createDebitNote(
                    //     res.id,
                    //     debitNote,
                    //     res,
                    //     this.policiesCount
                    // );
                    let insuranceType = '';
                    const productType = this.getInsuranceType;
                    if (productType == 'Comprehensive') {
                        insuranceType = 'MCP';
                    } else {
                        insuranceType = 'THP';
                    }

                    this.http
                        .get<any>(
                            `https://flosure-number-generation.herokuapp.com/aplus-invoice-number/1/0/${insuranceType}`
                        )
                        .subscribe(async (res) => {
                            debitNote.debitNoteNumber = res.data.invoice_number;

                            console.log(
                                'DEBITNOTE>>>>',
                                res.data.invoice_number
                            );

                            this.http
                                .post<DebitNote>(
                                    `https://www.flosure-api.com/documents/debit-note/${this.policyId}`,
                                    debitNote
                                )
                                .subscribe(
                                    async (res) => {
                                        console.log(res);
                                    },
                                    async (err) => {
                                        console.log(err);
                                    }
                                );

                            receipt.invoiceNumber = res.data.invoice_number;
                            this.receiptService
                                .addReceipt(
                                    receipt,
                                    this.quote.risks[0].insuranceType
                                )
                                .then((mess) => {
                                    console.log(
                                        'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
                                        mess
                                    );
                                    this.message.success(
                                        'Receipt Successfully created'
                                    );

                                    console.log(mess);
                                })
                                .catch((err) => {
                                    this.message.warning('Receipt Failed');
                                    console.log(err);
                                });
                        });

                    for (const clause of this.clauses) {
                        clause.policyId = res.id;
                        this.productClauseService.updatePolicyClause(clause);
                    }

                    for (const extenstion of this.extensions) {
                        extenstion.policyId = res.id;
                        this.productClauseService.updatePolicyExtension(
                            extenstion
                        );
                    }

                    for (const wording of this.wordings) {
                        wording.policyId = res.id;
                        this.productClauseService.updatePolicyWording(wording);
                    }

                    console.log(
                        'CLAUSE>>>>>>',
                        this.clauses,
                        this.extensions,
                        this.wordings
                    );

                    for (const risk of policy.risks) {
                        console.log('Risks>>>>', risk);

                        if (
                            risk.insuranceType === 'ThirdParty' ||
                            'ActOnly' ||
                            'ThirdPartyFireAndTheft'
                        ) {
                            const params = {
                                insuranceType: 1,
                                status: 1,
                                registrationMark: risk.regNumber.replace(
                                    /\s/g,
                                    ''
                                ),
                                dateFrom: risk.riskStartDate,
                                dateTo: risk.riskEndDate,
                                insurancePolicyNo: policy.policyNumber,
                                chassisNumber: risk.chassisNumber,
                            };

                            console.log('PARAMS>>>>>>', params);

                            // this.quotesService.postRtsa(params);
                        } else if (risk.insuranceType === 'Comprehensive') {
                            const params = {
                                insuranceType: 2,
                                status: 1,
                                registrationMark: risk.regNumber.replace(
                                    /\s/g,
                                    ''
                                ),
                                dateFrom: risk.riskStartDate,
                                dateTo: risk.riskEndDate,
                                insurancePolicyNo: policy.policyNumber,
                                chassisNumber: risk.chassisNumber,
                            };
                            console.log('PARAMS>>>>>>', params);

                            // this.quotesService.postRtsa(params);

                            console.log(
                                'Risk Type>>>>',
                                risk.insuranceType,
                                policy.policyNumber
                            );
                        }
                    }
                });

                this.isQuoteApproved = true;
                this.approvingQuote = false;
                // });

                this.receiptForm.reset();
                setTimeout(() => {
                    this.isVisible = false;
                    this.isOkLoading = false;
                }, 3000);

                this.generateID(this._id);
            }

            console.log('WHAAAAAAAT>>>>>>', this.getInsuranceType);
        }
    }

    sumArray(items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
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
                'netPremium',
            ],
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

            oReq.onload = (e) => {
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
                workbook.SheetNames.forEach((sheetName) => {
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
            levy: 0.03,
        };
        this.http
            .post<IRateResult>(
                `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe((data) => {
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
            levy: 0.03,
        };
        this.http
            .post<IRateResult>(
                `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe((data) => {
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
            levy: 0.03,
        };
        this.http
            .post<IRateResult>(
                `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe((data) => {
                this.loads.push({
                    loadType: 'Riot And Strike',
                    amount: Number(data.riotAndStrikePremium),
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
            levy: 0.03,
        };
        this.http
            .post<IRateResult>(
                `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe((data) => {
                this.loads.push({
                    loadType: this.selectedLoadingValue.value,
                    amount: Number(data.thirdPartyLoadingPremium),
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
            levy: 0.03,
        };
        this.http
            .post<IRateResult>(
                `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe((data) => {
                this.loads.push({
                    loadType: 'Increased Third Party Limit',
                    amount: Number(data.thirdPartyLoadingPremium),
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
            levy: 0.03,
        };
        this.http
            .post<IRateResult>(
                `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe((data) => {
                this.loads.push({
                    loadType: 'Car Stereo',
                    amount: Number(data.carStereoPremium),
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
            levy: 0.03,
        };
        this.http
            .post<IRateResult>(
                `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe((data) => {
                this.loads.push({
                    loadType: 'Territorial Extension',
                    amount: Number(data.territorialExtensionPremium),
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
            levy: 0.03,
        };
        this.http
            .post<IRateResult>(
                `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe((data) => {
                this.loads.push({
                    loadType: 'Loss Of Use',
                    amount: Number(data.lossOfUsePremium),
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
        // following methods check if the repective loads are in the loads array
        const riotAndStrikeInLoads = this.loads.some(
            (item) => item.loadType === 'Riot And Strike'
        );
        const increaseThirdPartyLimitInLoads = this.loads.some(
            (item) => item.loadType === 'Increased Third Party Limit'
        );
        const carStereoInLoads = this.loads.some(
            (item) => item.loadType === 'Car Stereo'
        );
        const territorialExtensionInLoads = this.loads.some(
            (item) => item.loadType === 'Territorial Extension'
        );
        const lossOfUseInLoads = this.loads.some(
            (item) => item.loadType === 'Loss Of Use'
        );

        // if the checked loading are not in loads array set there values to Zero!
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
                levy: 0.03,
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe((data) => {
                    this.premiumDiscount = Number(data.discount);
                    this.handleNetPremium();
                });
        }
    }

    handleDiscountThirdParty() {
        // following methods check if the repective loads are in the loads array
        const riotAndStrikeInLoads = this.loads.some(
            (item) => item.loadType === 'Riot And Strike'
        );
        const increaseThirdPartyLimitInLoads = this.loads.some(
            (item) => item.loadType === 'Increased Third Party Limit'
        );
        const carStereoInLoads = this.loads.some(
            (item) => item.loadType === 'Car Stereo'
        );
        const territorialExtensionInLoads = this.loads.some(
            (item) => item.loadType === 'Territorial Extension'
        );
        const lossOfUseInLoads = this.loads.some(
            (item) => item.loadType === 'Loss Of Use'
        );

        // if the checked loading are not in loads array set there values to Zero!
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
                levy: 0.03,
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe((data) => {
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

    // following method adds basic premium + loading - discount then applies levy then finds net premium
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

    // changes the quote basic premium to the inputed amount
    handleBasicPremiumAmount() {
        this.basicPremium = Number(this.basicPremiumAmount);
        this.handleNetPremium();
    }

    // changes the quote increase third party limit to inputed amount
    handleIncreasedThirdPartyLimitAmount() {
        this.loads.push({
            loadType: 'Increased Third Party Limit',
            amount: Number(this.increasedThirdPartyLimitAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote riot and strike to inputed amount
    handleRiotAndStrikeAmount() {
        this.loads.push({
            loadType: 'Riot And Strike',
            amount: Number(this.riotAndStrikeAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote car stereo to inputed amount
    handleCarStereoAmount() {
        this.loads.push({
            loadType: 'Car Stereo',
            amount: Number(this.carStereoAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleLossOfUseAmount() {
        this.loads.push({
            loadType: 'Loss Of Use',
            amount: Number(this.lossOfUseAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleTerritorialExtensionAmount() {
        this.loads.push({
            loadType: 'Territorial Extension',
            amount: Number(this.territorialExtensionAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleInexperiencedDriverAmount() {
        this.loads.push({
            loadType: 'Inexperienced Driver',
            amount: Number(this.inexperiencedDriverAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleUnderAgeDriverAmount() {
        this.loads.push({
            loadType: 'Under Age Driver',
            amount: Number(this.underAgeDriverAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // /////////////////////
    handleLossOfKeysAmount() {
        this.loads.push({
            loadType: 'Loss Of Keys',
            amount: Number(this.lossOfKeysAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handleMaliciousDamageAmount() {
        this.loads.push({
            loadType: 'Malicious Damage',
            amount: Number(this.maliciousDamageAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handleMedicalExpensesAmount() {
        this.loads.push({
            loadType: 'Medical Expenses',
            amount: Number(this.medicalExpensesAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handleInjuryAndDeathAmount() {
        this.loads.push({
            loadType: 'Injury/Death',
            amount: Number(this.injuryAndDeathAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handlePropertyDamageAmount() {
        this.loads.push({
            loadType: 'Property Damage',
            amount: Number(this.propertyDamageAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handleEarthquakeAmount() {
        this.loads.push({
            loadType: 'Earthquake',
            amount: Number(this.earthquakeAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handleExplosionsAmount() {
        this.loads.push({
            loadType: 'Explosions',
            amount: Number(this.explosionsAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handleFinancialLossAmount() {
        this.loads.push({
            loadType: 'Financial Loss',
            amount: Number(this.financialLossAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handleFireAndAlliedPerilsAmount() {
        this.loads.push({
            loadType: 'Fire And Allied Perils',
            amount: Number(this.fireAndAlliedPerilsAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handleLegalExpensesAmount() {
        this.loads.push({
            loadType: 'Legal Expenses',
            amount: Number(this.legalExpensesAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handleLandslideAmount() {
        this.loads.push({
            loadType: 'Landslide',
            amount: Number(this.landslideAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handlePassengerLiabilityAmount() {
        this.loads.push({
            loadType: 'Passenger Liability',
            amount: Number(this.passengerLiabilityAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    handlePermanentDisabilityAmount() {
        this.loads.push({
            loadType: 'Permanent Disability',
            amount: Number(this.permanentDisabilityAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }
    // /////////////////////

    // adds inputted discount to total discount amount
    handleNoClaimsDiscountAmount() {
        this.discounts.push({
            discountType: 'No Claims Discount',
            amount: Number(this.noClaimsDiscountAmount),
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleLoyaltyDiscountAmount() {
        this.discounts.push({
            discountType: 'Loyalty Discount',
            amount: Number(this.loyaltyDiscountAmount),
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleValuedClientDiscountAmount() {
        this.discounts.push({
            discountType: 'Valued Client Discount',
            amount: Number(this.valuedClientDiscountAmount),
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleLowTermAgreementDiscountAmount() {
        this.discounts.push({
            discountType: 'Low Term Agreement Discount',
            amount: Number(this.lowTermAgreementDiscountAmount),
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    /// Draft quotation calculations
    handleDraftQuotation() {
        this.quoteLoadingTotal = 0;
        this.quoteDiscountTotal = 0;
        this.quoteSumInsured = this.sumArray(this.risks, 'sumInsured');
        this.quoteBasicPremium = this.sumArray(this.risks, 'basicPremium');
        this.quoteLevy = this.sumArray(this.risks, 'premiumLevy');
        this.quoteNetPremium = this.sumArray(this.risks, 'netPremium');

        for (const risk of this.risks) {
            this.quoteLoadingTotal += this.sumArray(risk.loads, 'amount');
        }

        for (const risk of this.risks) {
            this.quoteDiscountTotal += this.sumArray(risk.discounts, 'amount');
        }

        this.isViewDraftQuotePDFVisible = true;
    }

    addLimitsOfLiability(): void {
        this.limitsOfLiability.push({

            liabilityType: 'deathAndInjuryPerPerson',
            amount: this.deathAndInjuryPerPerson,
            rate: this.deathAndInjuryPerPersonRate,
            premium: this.deathAndInjuryPerPersonPremium,
        });

        this.limitsOfLiability.push({

            liabilityType: 'deathAndInjuryPerEvent',
            amount: this.deathAndInjuryPerEvent,
            rate: this.deathAndInjuryPerEventRate,
            premium: this.deathAndInjuryPerEventPremium,
        });

        this.limitsOfLiability.push({

            liabilityType: 'propertyDamage',
            amount: this.propertyDamage,
            rate: this.propertyDamageRate,
            premium: this.propertyDamagePremium,
        });

        this.limitsOfLiability.push({

            liabilityType: 'combinedLimits',
            amount: this.combinedLimits,
            rate: this.combinedLimitsRate,
            premium: this.combinedLimitsPremium,
        });
    }

    addExcesses(): void {
        if (this.selectedValue.value === "Comprehensive") {
            for (const ex of this.excessList) {
                this.excesses.push({
                    excessType: ex.excessType,
                    amount: Number(ex.amount),
                });
            }
        } else if (this.selectedValue.value === "ThirdParty") {
            for (const exTHP of this.excessTHP) {
                this.excesses.push({
                    excessType: exTHP.description,
                    amount: Number(exTHP.amount),
                });
            }
        }
        // this.excesses.push({
        //     excessType: 'below21Years',
        //     amount: Number(this.excessesForm.get('below21Years').value),
        // });

        // this.excesses.push({
        //     excessType: 'over70Years',
        //     amount: Number(this.excessesForm.get('over70Years').value),
        // });

        // this.excesses.push({
        //     excessType: 'noLicence',
        //     amount: Number(this.excessesForm.get('noLicence').value),
        // });

        // this.excesses.push({
        //     excessType: 'careLessDriving',
        //     amount: Number(this.excessesForm.get('careLessDriving').value),
        // });

        // this.excesses.push({
        //     excessType: 'otherEndorsement',
        //     amount: Number(this.excessesForm.get('otherEndorsement').value),
        // });
    }



    //////////////////////////////////////////////////////////////
    /////////// cheque form//////////////////////////////
    /////////////////
    payChange(value) {
        console.log('value....', value);
        if (value === ' cheque') {
            this.cheque = true;
        } else {
            this.cheque = false;
        }
    }


    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    paymentMethodChange(value) {
        console.log('ON CHANGE>>>>', value);
        this.paymentMethod = value;
    }

    generateID(id) {
        console.log('++++++++++++ID++++++++++++');
        this._id = id;
        console.log(this._id);
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + this._id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }

    handleDeathAndInjuryPerPersonPremium(): void {
        this.deathAndInjuryPerPersonPremium =
            (Number(this.deathAndInjuryPerPerson) -
                this.deathAndInjuryPerPersonMax) *
            (this.deathAndInjuryPerPersonRate / 100);
        this.limitsTotalPremium =
            this.deathAndInjuryPerPersonPremium +
            this.deathAndInjuryPerEventPremium +
            this.propertyDamagePremium +
            this.combinedLimitsPremium;
        this.handleNetPremium();
    }

    handleDeathAndInjuryPerEventPremium(): void {
        this.deathAndInjuryPerEventPremium =
            (Number(this.deathAndInjuryPerEvent) -
                this.deathAndInjuryPerEventMax) *
            (this.deathAndInjuryPerEventRate / 100);
        this.limitsTotalPremium =
            this.deathAndInjuryPerPersonPremium +
            this.deathAndInjuryPerEventPremium +
            this.propertyDamagePremium +
            this.combinedLimitsPremium;
        this.handleNetPremium();
    }

    handlePropertyDamagePremium(): void {
        this.propertyDamagePremium =
            (Number(this.propertyDamage) - this.propertyDamageMax) *
            (this.propertyDamageRate / 100);
        this.limitsTotalPremium =
            this.deathAndInjuryPerPersonPremium +
            this.deathAndInjuryPerEventPremium +
            this.propertyDamagePremium +
            this.combinedLimitsPremium;
        this.handleNetPremium();
    }

    handleCombinedLimitsPremium(): void {
        this.combinedLimitsPremium =
            (Number(this.combinedLimits) - this.combinedLimitsMax) *
            (this.combinedLimitsRate / 100);
        this.limitsTotalPremium =
            this.deathAndInjuryPerPersonPremium +
            this.deathAndInjuryPerEventPremium +
            this.propertyDamagePremium +
            this.combinedLimitsPremium;
        this.handleNetPremium();
    }

    resetLimits(): void {
        this.deathAndInjuryPerPerson = this.defaultDeathAndInjuryPerPersonMax;
        this.deathAndInjuryPerEvent = this.defaultDeathAndInjuryPerEventMax;
        this.propertyDamage = this.defaultPropertyDamageMax;
        this.combinedLimits = this.defaultCombinedLimitsMax;
        this.deathAndInjuryPerPersonPremium = 0;
        this.deathAndInjuryPerEventPremium = 0;
        this.propertyDamagePremium = 0;
        this.combinedLimitsPremium = 0;
        this.limitsTotalPremium = 0;

        this.deathAndInjuryPerPersonRate = 0;
        this.deathAndInjuryPerEventRate = 0;
        this.propertyDamageRate = 0;
        this.combinedLimitsRate = 0;
    }
}
