import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    ICorporateClient,
    IIndividualClient,
} from 'src/app/clients/models/clients.model';
import {
    RiskModel,
    MotorQuotationModel,
    Load,
    LoadModel,
    DiscountModel,
    DiscountType,
    LimitsOfLiability,
    Excess,
} from '../../models/quote.model';
import { map, debounceTime, switchMap } from 'rxjs/operators';
import { NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IQuoteDTO } from '../../models/quote.dto';
import { v4 } from 'uuid';
import _ from 'lodash';
import {
    IBroker,
    ISalesRepresentative,
    IAgent,
} from 'src/app/settings/components/agents/models/agents.model';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import {
    IClause,
    IWording,
    IExtension,
    IPolicyClauses,
    IPolicyWording,
    IPolicyExtension,
    IExccess,
} from 'src/app/settings/models/underwriting/clause.model';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import * as moment from 'moment';
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
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { IProduct } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { ProductSetupsServiceService } from 'src/app/settings/components/product-setups/services/product-setups-service.service';

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

interface IQuoteNumberResult {
    resultQuoteNumber: string;
}

@Component({
    selector: 'app-create-quote',
    templateUrl: './create-quote.component.html',
    styleUrls: ['./create-quote.component.scss'],
})
export class CreateQuoteComponent implements OnInit {
    vehicleBodyType = VehicleBodyType;
    // motorComprehensiveloadingOptions = MotorComprehensiveLoadingOptions;
    motorComprehensiveloadingOptions = [];
    // motorThirdPartyloadingOptions = MotorThirdPartyLoadingOptions;
    motorThirdPartyloadingOptions = [];
    discountOptions = DiscountOptions;
    sourceOfBusinessOptions = SourceOfBusinessOptions;
    productTypeOptions = ProductTypeOptions;
    insuranceTypeOptions = InsuranceTypeOptions;
    limitsTypeOptions = LimitsOfLiabilityOptions;

    //Excess Variable
    excessList:IExccess[]=[];

    excessTHP:IExccess[]=[];
    excessAct:IExccess[]=[];
    excessFT:IExccess[]=[];

    //loading feedback
    creatingQuote: boolean = false;
    quotesList: MotorQuotationModel[];
    displayQuotesList: MotorQuotationModel[];
    quotesCount = 0;
    lastItem: any;

    clauseList: IClause[] = [];
    wordingList: IWording[] = [];
    extensionList: IExtension[] = [];
    PolicyClause: any[] = [];
    PolicyWording: any[] = [];
    PolicyExtension: any[] = [];
    selectedClauseValue: any[] = [];
    isClauseEditVisible = false;
    selectedExtensionValue: any[] = [];
    isExtensionEditVisible = false;
    selectedWordingValue: any[] = [];
    isWordingEditVisible = false;
    editClause: any;
    editExtension: any;
    editWording: any;
    editCache: { [key: string]: { edit: boolean; data: IWording } } = {};

    newClauseWording: IPolicyClauses;
    newWordingWording: IPolicyWording;
    newExtensionWording: IPolicyExtension;

    clauseForm: FormGroup;
    extensionForm: FormGroup;
    wordingForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly quoteService: QuotesService,
        private readonly clientsService: ClientsService,
        private msg: NzMessageService,
        private http: HttpClient,
        private readonly agentsService: AgentsService,
        private productClauseService: ClausesService,
        private policyService: PoliciesService,
        private productSevice: ProductSetupsServiceService
    ) {
        this.clauseForm = formBuilder.group({
            heading: ['', Validators.required],
            clauseDetails: ['', Validators.required],
        });
        this.extensionForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
        });
        this.wordingForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required],
        });

        
    }

    // conditional render of agent field based on mode(agent or user)
    agentMode = false;
    switchLoading = false;

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

    // loading feedback
    computeBasicPremiumIsLoading = false;
    computeIncreasedThirdPartyLimitIsLoading = false;
    computeRiotAndStrikeIsLoading = false;
    computeCarStereoIsLoading = false;
    computeTerritorialExtensionIsLoading = false;
    computeLossOfUseIsLoading = false;
    computeDiscountIsLoading = false;
    computePremiumIsLoading = false;
    handleDiscountIsLoading = false;

    addLoadIsLoading = false;

    //
    data: AOA = [
        [1, 2],
        [3, 4],
    ];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    /*name of the risks template that will be downloaded. */
    fileName = 'Risks_template.xlsx';
    fileLocation: string;

    motor: any;
    quoteForm: FormGroup;
    riskThirdPartyForm: FormGroup;
    riskActOnlyForm: FormGroup;
    riskThirdPartyFireAndTheftForm: FormGroup;
    riskComprehensiveForm: FormGroup;
    limitsOfLiabilityForm: FormGroup;
    combinedLimitsForm: FormGroup;
    excessesForm: FormGroup;
    clients: Array<IIndividualClient & ICorporateClient>;
    premiumLoadingForm: FormGroup;

    // intermediaries
    brokers: IBroker[];
    agents: IAgent[];
    salesRepresentatives: ISalesRepresentative[];

    // selected risk in risk table
    selectedRisk: RiskModel;

    // risk being edited
    currentRiskEdit: RiskModel;

    premiumComputationForm: FormGroup;

    risks: RiskModel[] = [];

    ///// Premium Computation
    // Basic Premium
    basicPremium: number;
    sumInsured: number;
    premiumRate: number;
    premiumRateType: string;

    LevyRate = 3;
    basicPremiumLevy: number;

    // Loading
    addingLoad: boolean;
    premiumLoadingTotal: number;

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

    // loads added to loading
    loads: LoadModel[] = [];

    // dicounts added
    discounts: DiscountModel[] = [];

    //limits of liability
    limitsOfLiability: LimitsOfLiability[] = [];

    //excesses
    excesses: Excess[] = [];

    // risk upload modal
    isVisible = false;
    isConfirmLoading = false;

    // risk details modal
    riskDetailsModalVisible = false;

    // close add risk panel
    isAddRiskPanelOpen: boolean;

    // Edit risk details
    isRiskDetailsEditmode = false;

    // selected basic premium input type option are rate and amount
    selectedBasicPremiunTypeValue = 'rate';
    // basic premium amount when user selects amount as basic premium input type
    basicPremiumAmount: number;

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
    // loss of use amount
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

    //standard limits
    defaultDeathAndInjuryPerPersonMax = 30100;
    defaultDeathAndInjuryPerEventMax = 60100;
    defaultPropertyDamageMax = 30000;
    defaultCombinedLimitsMax =
        this.defaultDeathAndInjuryPerPersonMax +
        this.defaultDeathAndInjuryPerEventMax +
        this.defaultPropertyDamageMax;

    //standard limits rates
    defaultDeathAndInjuryPerPersonRate = 0;
    defaultDeathAndInjuryPerEventRate = 0;
    defaultPropertyDamageRate = 0;
    defaultCombinedLimitsRate = 0;

    //limits
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

    todayYear = null;

    // set risk tamplate table not vivible
    isTabletemplate = true;

    // quoteNumber
    quoteNumber: string;

    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    selectedLimits = { label: 'Standard', value: 'standardLimits' };

    selectedLoadingValue: IExtension;

    // motor third party rates
    motorThirdPartyRates = {
        pirvate: { Q1: 165, Q2: 280, Q3: 370, Q4: 464 },
        commercial: { Q1: 199, Q2: 340, Q3: 452, Q4: 566 },
        'bus/taxi': { Q1: 270, Q2: 464, Q3: 618, Q4: 772 },
    };

    selectedDiscountValue = { label: '', value: '' };

    selectedSourceOfBusiness: string;

    startValue: Date | null = null;
    endValue: Date | null = null;
    endOpen = false;
    clientCode: any;
    clientName: any;
    concRisks: any[] =[];
    conChasis: any[]=[];

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

    log(value: { label: string; value: string }): void {
        this.selectedLoadingValue = {
            description: 'Increased Third Party Limit',
            heading: 'increasedThirdPartyLimits',
        };
        console.log('WHAT IS HERE<<<<',value);

    }

    disabledStartDate = (startValue: Date): boolean => {
        if (!startValue || !this.endValue) {
            return false;
        }
        return startValue.getTime() > this.endValue.getTime();
    };

    disabledEndDate = (endValue: Date): boolean => {
        if (!endValue || !this.startValue) {
            return false;
        }
        return endValue.getTime() <= this.startValue.getTime();
    };

    ngOnInit(): void {
        const user = localStorage.getItem('user');
        this.quoteForm = this.formBuilder.group({
            client: ['', Validators.required],
            messageCode: ['ewrewre', Validators.required],
            currency: ['', Validators.required],
            startDate: ['', Validators.required],
            policyNumberOfDays: [''],
            endDate: [''],
            quarter: ['', Validators.required],
            user: [user, Validators.required],
            status: ['Draft'],
            receiptStatus: ['Unreceipted'],
            sourceOfBusiness: ['', Validators.required],
            intermediaryName: [''],
        });

        this.policyService.getPolicies().subscribe((res) => {
            
            for(const policy of res) {
                this.concRisks = this.concRisks.concat(policy.risks)
            }
            console.log("RISKS<<<<<<", this.concRisks)
        })

        // this.productSevice.getProducts('e745338b-e9d5-4e07-b5a5-ddb84e54c3a5').subscribe((res) => {
        //     this.insuranceTypeOptions
        // })

        this.quoteService.getMotorQuotations().subscribe((quotes) => {
            this.quotesList = quotes;
            this.quotesCount = quotes.length;
            console.log('Quote Count', this.quotesCount);
            console.log('======= Quote List =======');
            console.log(this.quotesList);

            this.displayQuotesList = this.quotesList;

            this.lastItem = this.quotesList[this.quotesList.length - 1];
        });

        this.productClauseService.getExccesses().subscribe((res) => {
            this.excessList = res;
            this.excessTHP = res.filter((x) => x.productId === 'c40dcacc-b3fa-43fb-bb13-ac1e24bd657d');
            this.excessAct = res.filter((x) => x.productId === 'c40dcacc-b3fa-43fb-bb13-ac1e24bd657d');
            this.excessFT = res.filter((x) => x.productId === 'c40dcacc-b3fa-43fb-bb13-ac1e24bd657d');

        })
        

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

            this.riskComprehensiveForm = this.formBuilder.group({
                riskStartDate: ['', Validators.required],
                riskQuarter: ['', Validators.required],
                riskEndDate: ['', Validators.required],
                regNumber: ['', Validators.required, [this.regIDAsyncValidator]],
                vehicleMake: ['', Validators.required],
                vehicleModel: ['', Validators.required],
                engineNumber: ['',Validators.required, [this.engineIDAsyncValidator]],
                chassisNumber: ['', Validators.required, [this.chassisIDAsyncValidator]],
                yearOfManufacture: ['', Validators.required],
                color: ['', [Validators.required]],
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
            regNumber: ['', Validators.required, [this.regTHPIDAsyncValidator]],
                vehicleMake: ['', Validators.required],
                vehicleModel: ['', Validators.required],
                engineNumber: ['',Validators.required, [this.engineTHPIDAsyncValidator]],
                chassisNumber: ['', Validators.required, [this.chassisTHPIDAsyncValidator]],
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
            below21Years: ['', Validators.required],
            over70Years: ['', Validators.required],
            noLicence: ['', Validators.required],
            careLessDriving: ['', Validators.required],
            otherEndorsement: ['', Validators.required],
        });

        this.combinedLimitsForm = this.formBuilder.group({
            combinedLimits: ['', Validators.required],
            combinedLimitsPremium: ['', Validators.required],
            combinedLimitsRate: ['', Validators.required],
        });

        //set default values for limits of liability
        this.limitsOfLiabilityForm
            .get('deathAndInjuryPerPerson')
            .setValue('30100');
        this.limitsOfLiabilityForm
            .get('deathAndInjuryPerEvent')
            .setValue('60100');
        this.limitsOfLiabilityForm.get('propertyDamage').setValue('30000');
        this.limitsOfLiabilityForm
            .get('deathAndInjuryPerPersonPremium')
            .setValue('0');
        this.limitsOfLiabilityForm
            .get('deathAndInjuryPerEventPremium')
            .setValue('0');
        this.limitsOfLiabilityForm.get('propertyDamagePremium').setValue('0');
        // this.limitsOfLiabilityForm.get('protectionAndRemoval').setValue('500');
        // this.limitsOfLiabilityForm
        //     .get('deathBodilyInjuryPerEvent')
        //     .setValue('60100');
        // this.limitsOfLiabilityForm
        //     .get('deathBodilyInjuryPerPerson')
        //     .setValue('30100');
        // this.limitsOfLiabilityForm.get('propertyDamage').setValue('30000');
        // this.limitsOfLiabilityForm
        //     .get('medicalExpensesPerAccident')
        //     .setValue('100');
        // this.limitsOfLiabilityForm
        //     .get('medicalExpensesPerPerson')
        //     .setValue('50');
        // this.limitsOfLiabilityForm.get('unauthourizedRepair').setValue('500');

        //set defaults values for excesses
        this.excessesForm.get('below21Years').setValue('100');
        this.excessesForm.get('over70Years').setValue('100');
        this.excessesForm.get('noLicence').setValue('120');
        this.excessesForm.get('careLessDriving').setValue('120');
        this.excessesForm.get('otherEndorsement').setValue('100');

        // set default value for combined limits
        this.combinedLimitsForm
            .get('combinedLimits')
            .setValue( 93200
                // Number(
                //     this.limitsOfLiabilityForm.get('deathAndInjuryPerPerson')
                //         .value
                // ) +
                //     Number(
                //         this.limitsOfLiabilityForm.get('deathAndInjuryPerEvent')
                //             .value
                //     )
                //      +
                //     Number(
                //         this.limitsOfLiabilityForm.get('propertyDamage').value
                //     )
            );
        this.combinedLimitsForm.get('combinedLimitsPremium').setValue('0');

        // vehicle make loading
        const getVehicleMakeList = (name: string) =>
            this.http
                .get(`${this.vehicleMakeUrl}`)
                .pipe(map((res: any) => res.results))
                .pipe(
                    map((list: any) => {
                        return list.map(() => `${name}`);
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
                        return list.map(() => `${name}`);
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

        this.premiumComputationForm = this.formBuilder.group({
            sumInsured: ['', Validators.required],
            premiumRate: ['', Validators.required],
            increasedThirdPartyLimitsRate: ['', Validators.required],
            increasedThirdPartyLimitValue: ['', Validators.required],
            riotAndStrikeRate: ['', Validators.required],
            carStereoRate: ['', Validators.required],
            lossOfUseDailyRate: ['', Validators.required],
            lossOfUseDays: ['', Validators.required],
            premiumDiscountRate: ['', Validators.required],
        });

        // start of initialize computations
        this.sumInsured = 0;
        this.premiumRate = 6;

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
        this.territorialExtensionRateType = 'percentage';
        this.lossOfUseDailyRateType = 'percentage';
        this.premiumDiscountRateType = 'percentage';

        this.productClauseService.getClauses().subscribe((res) => {
            this.clauseList = res;
        });
        this.productClauseService.getExtensions().subscribe((res) => {
            this.extensionList = res;
            this.motorComprehensiveloadingOptions = res;
            this.motorThirdPartyloadingOptions = res.filter((x) => x.heading === 'increasedThirdPartyLimits');
            console.log("EXTENSIONS CHECK>>>>>>>",this.motorComprehensiveloadingOptions, this.motorThirdPartyloadingOptions )
        });
        this.productClauseService.getWordings().subscribe((res) => {
            this.wordingList = res;
        });
        this.updateEditCache();
    }


   
    disabledSubmissionDate = (submissionValue) => {
        if (!submissionValue) {
            return false;
        }
        return (submissionValue.valueOf() < moment().add(-1, 'days'));
    }
    


    // Validate registration Number
    regIDAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        this.policyService.getPolicies().subscribe((res) => {
            const activePolicy = res.filter((x)=> x.status === 'Active')
            
            for(const policy of activePolicy) {
                this.concRisks = this.concRisks.concat(policy.risks)
            }
            console.log("RISKS Comprehensive <<<<<<", this.concRisks)

            if(this.concRisks.length > 0){

                for(const reg of this.concRisks) {
                    if(control.value === reg.regNumber) {
                        observer.next({ error: true, duplicated: true });
                    break;
                    }else {
                        observer.next(null);
                      }
                }

            } else {
                observer.next(null);
            }
            observer.complete();
        })

         
      }, 1000);
    });


           // Validate Chassis Number
           chassisIDAsyncValidator = (control: FormControl) =>
           new Observable((observer: Observer<ValidationErrors | null>) => {
             setTimeout(() => {
               this.policyService.getPolicies().subscribe((res) => {
                   const activePolicy = res.filter((x)=> x.status === 'Active')
                   
                   for(const policy of activePolicy) {
                       this.concRisks = this.concRisks.concat(policy.risks)
                   }
                   console.log("RISKS Comprehensive <<<<<<", this.concRisks)
       
                   if(this.concRisks.length > 0){
       
                       for(const reg of this.concRisks) {
                           if(control.value === reg.chassisNumber) {
                               observer.next({ error: true, duplicated: true });
                           break;
                           }else {
                               observer.next(null);
                             }
                       }
       
                   } else {
                       observer.next(null);
                   }
                   observer.complete();
               })
       
             }, 1000);
           });



           // Validate Engine Number
    engineIDAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        this.policyService.getPolicies().subscribe((res) => {
            const activePolicy = res.filter((x)=> x.status === 'Active')
            
            for(const policy of activePolicy) {
                this.concRisks = this.concRisks.concat(policy.risks)
            }
            console.log("RISKS Comprehensive <<<<<<", this.concRisks)

            if(this.concRisks.length > 0){

                for(const reg of this.concRisks) {
                    if(control.value === reg.engineNumber) {
                        observer.next({ error: true, duplicated: true });
                    break;
                    }else {
                        observer.next(null);
                      }
                }

            } else {
                observer.next(null);
            }
            observer.complete();
        })

      }, 1000);
    });







      // Validate registration Number
      regTHPIDAsyncValidator = (control: FormControl) =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        setTimeout(() => {
          this.policyService.getPolicies().subscribe((res) => {
              const activePolicy = res.filter((x)=> x.status === 'Active')
              
              for(const policy of activePolicy) {
                  this.concRisks = this.concRisks.concat(policy.risks)
              }
              console.log("RISKS Comprehensive <<<<<<", this.concRisks)
  
              if(this.concRisks.length > 0){
  
                  for(const reg of this.concRisks) {
                      if(control.value === reg.regNumber) {
                          observer.next({ error: true, duplicated: true });
                      break;
                      }else {
                          observer.next(null);
                        }
                  }
  
              } else {
                  observer.next(null);
              }
              observer.complete();
          })
  
           
        }, 1000);
      });
  
  
             // Validate Chassis Number
             chassisTHPIDAsyncValidator = (control: FormControl) =>
             new Observable((observer: Observer<ValidationErrors | null>) => {
               setTimeout(() => {
                 this.policyService.getPolicies().subscribe((res) => {
                     const activePolicy = res.filter((x)=> x.status === 'Active')
                     
                     for(const policy of activePolicy) {
                         this.concRisks = this.concRisks.concat(policy.risks)
                     }
                     console.log("RISKS Comprehensive <<<<<<", this.concRisks)
         
                     if(this.concRisks.length > 0){
         
                         for(const reg of this.concRisks) {
                             if(control.value === reg.chassisNumber) {
                                 observer.next({ error: true, duplicated: true });
                             break;
                             }else {
                                 observer.next(null);
                               }
                         }
         
                     } else {
                         observer.next(null);
                     }
                     observer.complete();
                 })
         
               }, 1000);
             });
  
  
  
             // Validate Engine Number
      engineTHPIDAsyncValidator = (control: FormControl) =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        setTimeout(() => {
          this.policyService.getPolicies().subscribe((res) => {
              const activePolicy = res.filter((x)=> x.status === 'Active')
              
              for(const policy of activePolicy) {
                  this.concRisks = this.concRisks.concat(policy.risks)
              }
              console.log("RISKS Comprehensive <<<<<<", this.concRisks)
  
              if(this.concRisks.length > 0){
  
                  for(const reg of this.concRisks) {
                      if(control.value === reg.engineNumber) {
                          observer.next({ error: true, duplicated: true });
                      break;
                      }else {
                          observer.next(null);
                        }
                  }
  
              } else {
                  observer.next(null);
              }
              observer.complete();
          })
  
        }, 1000);
      });




 
    handleComprehensiveRiskEndDateCalculation(): void {
        if (
            this.riskComprehensiveForm.get('riskStartDate').value != '' &&
            this.riskComprehensiveForm.get('riskQuarter').value != ''
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
                lossOfUseDays: 0,
                lossOfUseRate: 0,
                territorialExtensionWeeks: 0,
                territorialExtensionCountries: 0,
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

                    let startDate = moment(
                        this.riskComprehensiveForm.get('riskStartDate').value
                    );
                    let endDate = moment(nd);
                    let numberOfDays = endDate.diff(startDate, 'days');
                    let expiryQuarter = moment(endDate).quarter();
                    let expiryYear = moment(endDate)
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
            this.riskThirdPartyForm.get('riskStartDate').value != '' &&
            this.riskThirdPartyForm.get('riskQuarter').value != ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.riskThirdPartyForm.get('riskStartDate').value,
                quarter: Number(
                    this.riskThirdPartyForm.get('riskQuarter').value
                ),
                appliedDiscount: 0,
                discount: 0,
                carStereo: 0,
                carStereoRate: 0,
                lossOfUseDays: 0,
                lossOfUseRate: 0,
                territorialExtensionWeeks: 0,
                territorialExtensionCountries: 0,
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
            let startDate = moment(
                this.riskComprehensiveForm.get('riskStartDate').value
            );
            let endDate = moment(
                this.riskComprehensiveForm.get('riskEndDate').value
            );

            let numberOfDays = endDate.diff(startDate, 'days');
            let expiryQuarter = moment(endDate).quarter();
            let expiryYear = moment(endDate).year().toString().slice(-2);

            this.riskComprehensiveForm
                .get('numberOfDays')
                .setValue(numberOfDays);

            this.riskComprehensiveForm
                .get('expiryQuarter')
                .setValue(expiryQuarter + '/' + expiryYear);

            this.basicPremium =
                (Number(numberOfDays) / 365) *
                (Number(this.premiumRate) / 100) *
                Number(this.sumInsured);
            this.handleNetPremium();
        } else {
            let startDate = moment(
                this.riskThirdPartyForm.get('riskStartDate').value
            );
            let endDate = moment(
                this.riskThirdPartyForm.get('riskEndDate').value
            );

            let numberOfDays = endDate.diff(startDate, 'days');
            let expiryQuarter = moment(endDate).quarter();
            let expiryYear = moment(endDate).year().toString().slice(-2);

            this.riskThirdPartyForm.get('numberOfDays').setValue(numberOfDays);

            this.riskThirdPartyForm
                .get('expiryQuarter')
                .setValue(expiryQuarter + '/' + expiryYear);
        }
    }

    handlePolicyEndDateCalculation(): void {
        if (
            this.quoteForm.get('startDate').value != '' &&
            this.quoteForm.get('quarter').value != ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.quoteForm.get('startDate').value,
                quarter: Number(this.quoteForm.get('quarter').value),
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
                    this.quoteForm.get('endDate').setValue(nd);

                    let startDate = moment(
                        this.quoteForm.get('startDate').value
                    );
                    let endDate = moment(nd);
                    let numberOfDays = endDate.diff(startDate, 'days');
                    this.quoteForm
                        .get('policyNumberOfDays')
                        .setValue(numberOfDays);
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
                    // this.basicPremium = Number(data.basicPremium);
                    // this.handleNetPremium();
                    this.basicPremium =
                        (Number(
                            this.riskComprehensiveForm.get('numberOfDays').value
                        ) /
                            365) *
                        (Number(this.premiumRate) / 100) *
                        Number(this.sumInsured);
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

    handleBasicPremiumCalculationActOnly(): void {
        if (
            this.riskActOnlyForm.get('productType').value != '' &&
            this.riskActOnlyForm.get('riskQuarter').value != ''
        ) {
            if (this.riskActOnlyForm.get('productType').value == 'Private') {
                if (this.riskActOnlyForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 165;
                }
                if (this.riskActOnlyForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 280;
                }
                if (this.riskActOnlyForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 370;
                }
                if (this.riskActOnlyForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 464;
                }
            }
            if (this.riskActOnlyForm.get('productType').value == 'Commercial') {
                if (this.riskActOnlyForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 199;
                }
                if (this.riskActOnlyForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 340;
                }
                if (this.riskActOnlyForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 452;
                }
                if (this.riskActOnlyForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 566;
                }
            }
            if (this.riskActOnlyForm.get('productType').value == 'Bus/Taxi') {
                if (this.riskActOnlyForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 270;
                }
                if (this.riskActOnlyForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 464;
                }
                if (this.riskActOnlyForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 618;
                }
                if (this.riskActOnlyForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 772;
                }
            }
        }

        this.handleNetPremium();
    }

    handleBasicPremiumCalculationThirdPartyFireAndTheft(): void {
        if (
            this.riskThirdPartyFireAndTheftForm.get('productType').value !=
                '' &&
            this.riskThirdPartyFireAndTheftForm.get('riskQuarter').value != ''
        ) {
            if (
                this.riskThirdPartyFireAndTheftForm.get('productType').value ==
                'Private'
            ) {
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 1
                ) {
                    this.basicPremium = 165;
                }
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 2
                ) {
                    this.basicPremium = 280;
                }
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 3
                ) {
                    this.basicPremium = 370;
                }
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 4
                ) {
                    this.basicPremium = 464;
                }
            }
            if (
                this.riskThirdPartyFireAndTheftForm.get('productType').value ==
                'Commercial'
            ) {
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 1
                ) {
                    this.basicPremium = 199;
                }
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 2
                ) {
                    this.basicPremium = 340;
                }
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 3
                ) {
                    this.basicPremium = 452;
                }
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 4
                ) {
                    this.basicPremium = 566;
                }
            }
            if (
                this.riskThirdPartyFireAndTheftForm.get('productType').value ==
                'Bus/Taxi'
            ) {
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 1
                ) {
                    this.basicPremium = 270;
                }
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 2
                ) {
                    this.basicPremium = 464;
                }
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 3
                ) {
                    this.basicPremium = 618;
                }
                if (
                    this.riskThirdPartyFireAndTheftForm.get('riskQuarter')
                        .value == 4
                ) {
                    this.basicPremium = 772;
                }
            }
        }

        this.handleNetPremium();
    }

    // onSubmit() {
    //     const some = this.quoteForm.value;
    //     this.quoteService.addMotorQuotation(some);

    //     localStorage.setItem('motor', JSON.stringify(some));
    //     this.quoteService.getRisk('an');
    // }

    // add third party risk
    addThirdPartyRisk(): void {
        this.addLimitsOfLiability();
        this.addExcesses();

        const some: RiskModel[] = [];
        some.push({
            ...this.riskThirdPartyForm.value,
            id: v4(),
            sumInsured: 0,
            premiumRate: 0,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            limitsOfLiability: this.limitsOfLiability,
            excesses: this.excesses,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: this.basicPremiumLevy,
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
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;

        this.isAddRiskPanelOpen = false;
        console.log(this.risks);
    }

    // add Act Only risk
    addActOnlyRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskActOnlyForm.value,
            id: v4(),
            sumInsured: 0,
            premiumRate: 0,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: this.basicPremiumLevy,
            netPremium: this.netPremium,
            insuranceType: this.selectedValue.value,
        });
        this.risks = [...this.risks, ...some];

        // reset form after submitting
        this.riskActOnlyForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;

        this.isAddRiskPanelOpen = false;
        console.log(this.risks);
    }

    // add third party Fire And Theft risk
    addThirdPartyFireAndTheftRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskThirdPartyFireAndTheftForm.value,
            id: v4(),
            sumInsured: 0,
            premiumRate: 0,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: this.basicPremiumLevy,
            netPremium: this.netPremium,
            insuranceType: this.selectedValue.value,
        });
        this.risks = [...this.risks, ...some];

        // reset form after submitting
        this.riskThirdPartyFireAndTheftForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;

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
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;
    }

    // reset third party risk form
    resetActOnlyForm(e: MouseEvent) {
        e.preventDefault();
        this.riskActOnlyForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;
    }

    // reset third party risk form
    resetThirdPartyFireAndTheftRiskForm(e: MouseEvent) {
        e.preventDefault();
        this.riskThirdPartyFireAndTheftForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;
    }

    // add comprehesive risk
    addComprehensiveRisk(): void {
        this.addLimitsOfLiability();
        this.addExcesses();

        console.log('here=>>>');
        console.log(this.limitsOfLiability);

        const some: RiskModel[] = [];
        some.push({
            ...this.riskComprehensiveForm.value,
            id: v4(),
            sumInsured: Number(this.sumInsured),
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            limitsOfLiability: this.limitsOfLiability,
            excesses: this.excesses,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: this.basicPremiumLevy,
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
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;

        this.isAddRiskPanelOpen = false;
        console.log(this.risks);
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
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;
    }

    resetForms() {
        this.riskComprehensiveForm.reset();
        this.riskThirdPartyForm.reset();
        this.riskActOnlyForm.reset();
        this.riskThirdPartyFireAndTheftForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
        this.selectedRisk = risk;
        this.riskDetailsModalVisible = true;

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
        } else {
            this.riskComprehensiveForm
                .get('vehicleMake')
                .setValue(risk.vehicleMake);
            this.riskThirdPartyForm
                .get('vehicleModel')
                .setValue(risk.vehicleModel);
            this.riskThirdPartyForm
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
        }

        this.selectedVehicleMake = risk.vehicleMake;
        this.selectedVehicleModel = risk.vehicleModel;
        this.sumInsured = risk.sumInsured;
        this.premiumRate = risk.premiumRate;
        this.loads = risk.loads;
        this.discounts = risk.discounts;
        this.basicPremium = risk.basicPremium;
        this.premiumLoadingTotal = risk.loadingTotal;
        this.premiumDiscount = risk.discountTotal;
        this.basicPremiumLevy = risk.premiumLevy;
        this.netPremium = risk.netPremium;
    }

    // remove risk from risks table
    removeRisk(riskId: string): void {
        this.risks = this.risks.filter((risk) => risk.id !== riskId);
    }

    // save risks changes after editing
    saveRisk(): void {
        this.currentRiskEdit = this.selectedRisk;

        if (this.selectedValue.value === 'Comprehensive') {
            // comprehensive risk
            const some: RiskModel = {
                ...this.riskComprehensiveForm.value,
                sumInsured: Number(this.sumInsured),
                premiumRate: this.premiumRate,
                basicPremium: this.basicPremium,
                loads: this.loads,
                discounts: this.discounts,
                limitsOfLiability: this.limitsOfLiability,
                excesses: this.excesses,
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
        } else if (this.selectedValue.value === 'ThirdParty') {
            // third party risk
            const some: RiskModel = {
                ...this.riskThirdPartyForm.value,
                sumInsured: 0,
                premiumRate: 0,
                basicPremium: this.basicPremium,
                loads: this.loads,
                discounts: this.discounts,
                limitsOfLiability: this.limitsOfLiability,
                excesses: this.excesses,
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
        } else if (this.selectedValue.value === 'ActOnly') {
            // third party risk
            const some: RiskModel = {
                ...this.riskActOnlyForm.value,
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
        } else if (this.selectedValue.value === 'ThirdPartyFireAndTheft') {
            // third party risk
            const some: RiskModel = {
                ...this.riskThirdPartyFireAndTheftForm.value,
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

    deleteRow(): void {}

    closeRiskDetails() {
        this.riskDetailsModalVisible = false;
    }

    async addQuote(): Promise<void> {
        this.creatingQuote = true;
        this.clientCode = this.quoteForm.controls.client.value.id;
        if (this.quoteForm.controls.client.value.clientType === 'Individual') {
            this.clientName =
                this.quoteForm.controls.client.value.firstName +
                ' ' +
                this.quoteForm.controls.client.value.lastName;
        } else {
            this.clientName = this.quoteForm.controls.client.value.companyName;
        }
        console.log('Client Details>>>>>>', this.clientCode, this.clientName);
        const quote: MotorQuotationModel = {
            ...this.quoteForm.value,
            dateCreated: new Date(),
            clientCode: this.clientCode,
            client: this.clientName,
            coverCode: '',
            underwritingYear: new Date(),
            branch: '',
            basicPremiumSubTotal: '',
            user: this.agentMode
                ? this.quoteForm.get('user').value
                : localStorage.getItem('user'),
            risks: this.risks,
        };

        const quoteDto: IQuoteDTO = {
            quoteNumber: quote.quoteNumber,
            revisionNumber: '00001',
            startDate: quote.startDate as Date,
            endDate: quote.endDate as Date,
            client: quote.client,
            status: 'Draft',
            preparedBy: 'Charles Malama',
            motorQuotationModelId: quote.id,
            dateCreated: new Date(),
            clientCode: quote.clientCode,
            messageCode: '123001',
            coverCode: quote.coverCode,
            currency: quote.currency,
            riskModelId: '023001',
            regNumber: quote.risks[0].regNumber,
            vehicleMake: quote.risks[0].vehicleMake,
            vehicleModel: quote.risks[0].vehicleModel,
            engineNumber: quote.risks[0].engineNumber,
            chassisNumber: quote.risks[0].chassisNumber,
            color: quote.risks[0].color,
            estimatedValue: quote.risks[0].estimatedValue,
            productType: quote.risks[0].productType,
            messageModelId: '02501',
            description: '',
            coverModelId: '0948398',
        };

        // this.quoteService.generateQuote(quoteDto).subscribe((res) => {
        // this.gqlquoteService
        //     .addQuote({
        //         clientId: 'some', // System can't keep track of this guy
        //         quoteNumber: quote.quoteNumber,
        //         quoteUrl: res.Location
        //     })
        //     .then(res => {
        //         res.subscribe(x => {
        //             console.log(x);
        //         });
        //     });
        // });

        // firebase
        // await this.quoteService
        //     .addMotorQuotation(quote)
        //     .then(() => {
        //         this.msg.success('Quotation Successfully created');
        //         this.router.navigateByUrl('/flosure/quotes/quotes-list');
        //     })
        //     .catch(() => {
        //         this.msg.error('Quotation Creation Failed');
        //     });

        // postgres
        for (const clause of this.selectedClauseValue) {
            this.newClauseWording = {
                ...clause,
                id: v4(),
                policyId: this.risks[0].id,
            };
            this.productClauseService.addPolicyClause(this.newClauseWording);
        }

        for (const extension of this.selectedExtensionValue) {
            this.newExtensionWording = {
                ...extension,
                id: v4(),
                policyId: this.risks[0].id,
            };
            this.productClauseService.addPolicyExtension(
                this.newExtensionWording
            );
        }

        for (const wording of this.selectedWordingValue) {
            this.newWordingWording = {
                ...wording,
                id: v4(),
                policyId: this.risks[0].id,
            };
            this.productClauseService.addPolicyWording(this.newWordingWording);
        }

        await this.quoteService.createMotorQuotation(quote, this.quotesCount);
        this.creatingQuote = false;
    }

    showModal(): void {
        this.isVisible = true;
    }

    handleCancel(): void {
        this.isVisible = false;
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

    // what happens when a file is uploaded
    handleChange({ file }: UploadChangeParam): void {
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
            this.isVisible = false;

            // get uploaded excel file and convert it to array
            // XMLHttpRequest
            const oReq = new XMLHttpRequest();
            oReq.open('GET', this.fileLocation, true);
            oReq.responseType = 'arraybuffer';

            oReq.onload = () => {
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

    switchMode(): void {
        if (!this.switchLoading) {
            this.switchLoading = true;
            setTimeout(() => {
                this.agentMode = !this.agentMode;
                this.switchLoading = false;
            }, 500);
        }
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

    addLoad() {
        this.addLoadIsLoading = true;
        setTimeout(() => {
            this.addingLoad = true;
            this.addLoadIsLoading = false;
        }, 1000);
    }

    // Premium computation methods
    // Basic Premum Computation

    handleDiscount(discountType: DiscountType) {
        this.handleDiscountIsLoading = true;
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

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            appliedDiscount: Number(this.premiumDiscount),
            discount: Number(this.premiumDiscountRate) / 100,
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
                this.discounts.push({
                    discountType,
                    amount: Number(data.discount),
                });
                this.premiumDiscount = this.sumArray(this.discounts, 'amount');
                this.handleNetPremium();
                this.handleDiscountIsLoading = false;
            });
    }

    handleDiscountThirdParty() {
        this.handleDiscountIsLoading = true;
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
                appliedDiscount: this.premiumDiscount,
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
                    this.handleDiscountIsLoading = false;
                });
        }
    }

    computeThirdPartyPremium() {
        this.computePremiumIsLoading = true;
        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            appliedDiscount: this.premiumDiscount,
            discount: Number(this.premiumDiscountRate) / 100,
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
                this.handleNetPremium();
                this.computePremiumIsLoading = false;
            });
    }

    // Loading computation
   

    computeIncreasedThirdPartyLimit() {
        this.computeIncreasedThirdPartyLimitIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            appliedDiscount: this.premiumDiscount,
            discount: Number(this.premiumDiscountRate) / 100,
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
                    loadType: this.selectedLoadingValue.description,
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
            appliedDiscount: this.premiumDiscount,
            discount: Number(this.premiumDiscountRate) / 100,
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
            if (
                (this.sumInsured && this.sumInsured !== 0) ||
                (this.basicPremiumAmount && this.basicPremiumAmount !== 0)
            ) {
                if (
                    (this.premiumRate && this.premiumRate !== 0) ||
                    (this.basicPremiumAmount && this.basicPremiumAmount !== 0)
                ) {
                    if (this.netPremium > 0) {
                        return true;
                    }
                }
            }
        }
    }

    // sum up specific values in array
    sumArray(items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
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
            this.basicPremiumLevy +
            this.limitsTotalPremium;
    }

    // changes the quote basic premium to the inputed amount
    handleBasicPremiumAmount() {
        this.basicPremium = Number(this.basicPremiumAmount);
        this.handleNetPremium();
    }

    // changes the quote increase third party limit to inputed amount
    handleIncreasedThirdPartyLimitAmount() {
        this.loads.push({
            loadType: this.selectedLoadingValue.description,
            amount: Number(this.increasedThirdPartyLimitAmount),
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

   

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

    onEditWording(value) {
        console.log('Checke>>>>>>>>>>>', value);
        this.editWording = value;

        this.wordingForm.get('heading').setValue(this.editWording.heading);
        this.wordingForm
            .get('description')
            .setValue(this.editWording.description);
        this.isWordingEditVisible = true;
    }
    onEditExtension(value) {
        console.log('Checke>>>>>>>>>>>', value);
        this.editExtension = value;

        this.extensionForm.get('heading').setValue(this.editExtension.heading);
        this.extensionForm
            .get('description')
            .setValue(this.editExtension.description);
        this.isExtensionEditVisible = true;
    }
    onEditClauses(value) {
        console.log('Checke>>>>>>>>>>>', value);
        this.editClause = value;

        this.clauseForm.get('heading').setValue(this.editClause.heading);
        this.clauseForm
            .get('clauseDetails')
            .setValue(this.editClause.clauseDetails);
        this.isClauseEditVisible = true;
    }

    handleEditClauseOk() {
        this.editClause.heading = this.clauseForm.controls.heading.value;
        this.editClause.clauseDetails = this.clauseForm.controls.clauseDetails.value;

        const index = this.selectedClauseValue.indexOf(this.editClause);
        this.selectedClauseValue[index] = this.editClause;

        console.log('Clause>>>>>>', this.editClause, this.selectedClauseValue);
        this.isClauseEditVisible = false;
    }
    handleEditClauseCancel() {
        this.isClauseEditVisible = false;
    }

    handleEditExtensionOk() {
        this.editExtension.heading = this.extensionForm.controls.heading.value;
        this.editExtension.description = this.extensionForm.controls.description.value;

        const index = this.selectedExtensionValue.indexOf(this.editExtension);
        this.selectedExtensionValue[index] = this.editExtension;

        console.log(
            'Clause>>>>>>',
            this.editExtension,
            this.selectedExtensionValue
        );
        this.isExtensionEditVisible = false;
    }
    handleEditExtensionCancel() {
        this.isExtensionEditVisible = false;
    }

    handleEditWordingOk() {
        this.editWording.heading = this.wordingForm.controls.heading.value;
        this.editWording.description = this.wordingForm.controls.description.value;

        const index = this.selectedWordingValue.indexOf(this.editWording);
        this.selectedWordingValue[index] = this.editWording;

        console.log(
            'Clause>>>>>>',
            this.editWording,
            this.selectedWordingValue
        );
        this.isWordingEditVisible = false;
    }
    handleEditWordingCancel() {
        this.isWordingEditVisible = false;
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    cancelEdit(id: string): void {
        const index = this.selectedWordingValue.findIndex(
            (item) => item.id === id
        );
        this.editCache[id] = {
            data: { ...this.selectedWordingValue[index] },
            edit: false,
        };
    }

    saveEdit(id: string): void {
        const index = this.selectedWordingValue.findIndex(
            (item) => item.id === id
        );
        Object.assign(
            this.selectedWordingValue[index],
            this.editCache[id].data
        );
        this.editCache[id].edit = false;

        console.log('EDITED WORDING>>>>', this.selectedWordingValue);
    }

    updateEditCache(): void {
        this.selectedWordingValue.forEach((item) => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item },
            };
        });
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
            amount: this.combinedLimitsForm.controls.combinedLimits.value,
            // amount: this.combinedLimits,
            rate: this.combinedLimitsRate,
            premium: this.combinedLimitsPremium,
        });
    }

    addExcesses(): void {
        if(this.selectedValue.value === "Comprehensive") {
            for(const ex of this.excessList) {
                this.excesses.push({
                    excessType: ex.description,
                    amount: Number(ex.amount),
                });
            }
        }else if(this.selectedValue.value === "ThirdParty") {
            for(const exTHP of this.excessTHP) {
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
            (Number(this.combinedLimitsForm.controls.combinedLimits.value) - this.combinedLimitsMax) *
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
