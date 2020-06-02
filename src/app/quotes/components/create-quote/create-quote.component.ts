import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    ICorporateClient,
    IIndividualClient
} from 'src/app/clients/models/clients.model';
import {
    RiskModel,
    MotorQuotationModel,
    Load,
    LoadModel,
    DiscountModel,
    DiscountType
} from '../../models/quote.model';
import { map, debounceTime, switchMap } from 'rxjs/operators';
import { NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IQuoteDTO } from '../../models/quote.dto';
import { v4 } from 'uuid';
import _ from 'lodash';
import {
    IBroker,
    ISalesRepresentative,
    IAgent
} from 'src/app/settings/components/agents/models/agents.model';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import {
    IClause,
    IWording,
    IExtension,
    IPolicyClauses,
    IPolicyWording,
    IPolicyExtension
} from 'src/app/settings/models/underwriting/clause.model';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';

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
    styleUrls: ['./create-quote.component.scss']
})
export class CreateQuoteComponent implements OnInit {
    //loading feedback
    creatingQuote: boolean = false;

    clauseList: IClause[];
    wordingList: IWording[] = [];
    extensionList: IExtension[];
    PolicyClause: any[];
    PolicyWording: any[];
    PolicyExtension: any[];
    selectedClauseValue: any[];
    isClauseEditVisible = false;
    selectedExtensionValue: any[];
    isExtensionEditVisible = false;
    selectedWordingValue: any[];
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
        private productClauseService: ClausesService
    ) {
        this.clauseForm = formBuilder.group({
            heading: ['', Validators.required],
            clauseDetails: ['', Validators.required]
        });
        this.extensionForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required]
        });
        this.wordingForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required]
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
        [3, 4]
    ];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    /*name of the risks template that will be downloaded. */
    fileName = 'Risks_template.xlsx';
    fileLocation: string;

    motor: any;
    quoteForm: FormGroup;
    riskThirdPartyForm: FormGroup;
    riskComprehensiveForm: FormGroup;
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

    todayYear = null;

    // set risk tamplate table not vivible
    isTabletemplate = true;

    // quoteNumber
    quoteNumber: string;

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

    // motor third party rates
    motorThirdPartyRates = {
        pirvate: { Q1: 165, Q2: 280, Q3: 370, Q4: 464 },
        commercial: { Q1: 199, Q2: 340, Q3: 452, Q4: 566 },
        'bus/taxi': { Q1: 270, Q2: 464, Q3: 618, Q4: 772 }
    };

    // discounts
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

    startValue: Date | null = null;
    endValue: Date | null = null;
    endOpen = false;

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

    log(value: { label: string; value: string }): void {
        this.selectedLoadingValue = {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits'
        };
        console.log(value);
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
            endDate: [''],
            quarter: ['', Validators.required],
            user: [user, Validators.required],
            status: ['Draft'],
            receiptStatus: ['Unreceipted'],
            sourceOfBusiness: ['', Validators.required],
            intermediaryName: ['']
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

        this.riskComprehensiveForm = this.formBuilder.group({
            riskStartDate: ['', Validators.required],
            riskQuarter: ['', Validators.required],
            riskEndDate: ['', Validators.required],
            regNumber: ['', Validators.required],
            vehicleMake: ['', Validators.required],
            vehicleModel: ['', Validators.required],
            engineNumber: [''],
            chassisNumber: ['', Validators.required],
            yearOfManufacture: ['', Validators.required],
            color: ['', [Validators.required]],
            // sumInsured: ['', Validators.required],
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
            engineNumber: [''],
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
                        return list.map(() => `${name}`);
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
                        return list.map(() => `${name}`);
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

        this.premiumComputationForm = this.formBuilder.group({
            sumInsured: ['', Validators.required],
            premiumRate: ['', Validators.required],
            increasedThirdPartyLimitsRate: ['', Validators.required],
            increasedThirdPartyLimitValue: ['', Validators.required],
            riotAndStrikeRate: ['', Validators.required],
            carStereoRate: ['', Validators.required],
            lossOfUseDailyRate: ['', Validators.required],
            lossOfUseDays: ['', Validators.required],
            premiumDiscountRate: ['', Validators.required]
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
        this.territorialExtensionRateType = 'percentage';
        this.lossOfUseDailyRateType = 'percentage';
        this.premiumDiscountRateType = 'percentage';

        this.productClauseService.getClauses().subscribe(res => {
            this.clauseList = res;
        });
        this.productClauseService.getExtensions().subscribe(res => {
            this.extensionList = res;
        });
        this.productClauseService.getWordings().subscribe(res => {
            this.wordingList = res;
        });
        this.updateEditCache();
    }

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
                levy: 0
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.quoteForm.get('endDate').setValue(data.endDate);
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

    // onSubmit() {
    //     const some = this.quoteForm.value;
    //     this.quoteService.addMotorQuotation(some);

    //     localStorage.setItem('motor', JSON.stringify(some));
    //     this.quoteService.getRisk('an');
    // }

    // add third party risk
    addThirdPartyRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskThirdPartyForm.value,
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

    // add comprehesive risk
    addComprehensiveRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskComprehensiveForm.value,
            id: v4(),
            sumInsured: Number(this.sumInsured),
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: this.basicPremiumLevy,
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
        this.premiumLoadingTotal = risk.loadingTotal;
        this.premiumDiscount = risk.discountTotal;
        this.basicPremiumLevy = risk.premiumLevy;
        this.netPremium = risk.netPremium;
    }

    // remove risk from risks table
    removeRisk(riskId: string): void {
        this.risks = this.risks.filter(risk => risk.id !== riskId);
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
                loadingTotal: this.premiumLoadingTotal,
                discountRate: this.premiumDiscountRate,
                premiumLevy: this.basicPremiumLevy,
                netPremium: this.netPremium,
                insuranceType: this.selectedValue.value
            };
            this.currentRiskEdit = some;

            const riskIndex = _.findIndex(this.risks, {
                id: this.selectedRisk.id
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
                insuranceType: this.selectedValue.value
            };
            this.selectedRisk = some;

            const riskIndex = _.findIndex(this.risks, {
                id: this.selectedRisk.id
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
        const quote: MotorQuotationModel = {
            ...this.quoteForm.value,
            dateCreated: new Date(),
            clientCode: '',
            coverCode: '',
            underwritingYear: new Date(),
            branch: '',
            basicPremiumSubTotal: '',
            user: this.agentMode
                ? this.quoteForm.get('user').value
                : localStorage.getItem('user'),
            risks: this.risks
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
            coverModelId: '0948398'
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
                policyId: this.risks[0].id
            };
            this.productClauseService.addPolicyClause(this.newClauseWording);
        }

        for (const extension of this.selectedExtensionValue) {
            this.newExtensionWording = {
                ...extension,
                id: v4(),
                policyId: this.risks[0].id
            };
            this.productClauseService.addPolicyExtension(
                this.newExtensionWording
            );
        }

        for (const wording of this.selectedWordingValue) {
            this.newWordingWording = {
                ...wording,
                id: v4(),
                policyId: this.risks[0].id
            };
            this.productClauseService.addPolicyWording(this.newWordingWording);
        }

        await this.quoteService.createMotorQuotation(quote);
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
            item => item.loadType === 'Riot And Strike'
        );
        const increaseThirdPartyLimitInLoads = this.loads.some(
            item => item.loadType === 'Increased Third Party Limit'
        );
        const carStereoInLoads = this.loads.some(
            item => item.loadType === 'Car Stereo'
        );
        const lossOfUseInLoads = this.loads.some(
            item => item.loadType === 'Loss Of Use'
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
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.discounts.push({
                    discountType,
                    amount: Number(data.discount)
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
            item => item.loadType === 'Riot And Strike'
        );
        const increaseThirdPartyLimitInLoads = this.loads.some(
            item => item.loadType === 'Increased Third Party Limit'
        );
        const carStereoInLoads = this.loads.some(
            item => item.loadType === 'Car Stereo'
        );
        const lossOfUseInLoads = this.loads.some(
            item => item.loadType === 'Loss Of Use'
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
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.netPremium = Number(data.totalPremium);
                this.handleNetPremium();
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
            appliedDiscount: this.premiumDiscount,
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
            appliedDiscount: this.premiumDiscount,
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
        return items.reduce(function(a, b) {
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
            amount: Number(this.increasedThirdPartyLimitAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote riot and strike to inputed amount
    handleRiotAndStrikeAmount() {
        this.loads.push({
            loadType: 'Riot And Strike',
            amount: Number(this.riotAndStrikeAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote car stereo to inputed amount
    handleCarStereoAmount() {
        this.loads.push({
            loadType: 'Car Stereo',
            amount: Number(this.carStereoAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleLossOfUseAmount() {
        this.loads.push({
            loadType: 'Loss Of Use',
            amount: Number(this.lossOfUseAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleTerritorialExtensionAmount() {
        this.loads.push({
            loadType: 'Territorial Extension',
            amount: Number(this.territorialExtensionAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleInexperiencedDriverAmount() {
        this.loads.push({
            loadType: 'Inexperienced Driver',
            amount: Number(this.inexperiencedDriverAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleUnderAgeDriverAmount() {
        this.loads.push({
            loadType: 'Under Age Driver',
            amount: Number(this.underAgeDriverAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleNoClaimsDiscountAmount() {
        this.discounts.push({
            discountType: 'No Claims Discount',
            amount: Number(this.noClaimsDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleLoyaltyDiscountAmount() {
        this.discounts.push({
            discountType: 'Loyalty Discount',
            amount: Number(this.loyaltyDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleValuedClientDiscountAmount() {
        this.discounts.push({
            discountType: 'Valued Client Discount',
            amount: Number(this.valuedClientDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleLowTermAgreementDiscountAmount() {
        this.discounts.push({
            discountType: 'Low Term Agreement Discount',
            amount: Number(this.lowTermAgreementDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // onSelectWording(value) {
    //     this.PolicyWording.push([...value]);
    //     console.log('Check>>>>>>>>>>>', value);
    // }
    // onSelectExtension(value) {
    //     this.PolicyExtension.push([...value]);
    //     console.log('Checka>>>>>>>>>>>', value);
    // }
    // onSelectClause(value) {
    //     console.log('Checkb>>>>>>>>>>>', value);
    //     this.PolicyClause.push([...value]);
    // }
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
}
