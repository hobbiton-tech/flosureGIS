import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    RiskModel,
    DiscountModel,
    LoadModel,
    DiscountType
} from 'src/app/quotes/models/quote.model';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { v4 } from 'uuid';

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
    selector: 'app-add-risk',
    templateUrl: './add-risk.component.html',
    styleUrls: ['./add-risk.component.scss']
})
export class AddRiskComponent implements OnInit {
    ///////////////////Risk Details Starts here//////////////////////////
    @Output()
    sendAddRiskEmitter: EventEmitter<any> = new EventEmitter();

    @Input()
    policyEndDate: Date;

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

    // selected risk in risk table
    selectedRisk: RiskModel;

    // risk being edited
    currentRiskEdit: RiskModel;

    premiumComputationForm: FormGroup;

    quoteNumber = '';
    risks: RiskModel[] = [];

    ///// Premium Computation

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
    // Basic Premium
    basicPremium: number;
    sumInsured: number;
    premiumRate: number;
    premiumRateType: string;

    LevyRate: number = 3;
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

    //dicounts added
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
    //loss of use amount
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
    selectedValue = { label: 'Motor Third Party', value: 'ThirdParty' };

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

    //motor third party rates
    motorThirdPartyRates = {
        pirvate: { Q1: 165, Q2: 280, Q3: 370, Q4: 464 },
        commercial: { Q1: 199, Q2: 340, Q3: 452, Q4: 566 },
        'bus/taxi': { Q1: 270, Q2: 464, Q3: 618, Q4: 772 }
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

    ///////////////////Risk Details ends here/////////////////////////////

    @Input()
    isAddRiskFormModalVisible: boolean;

    @Output()
    closeAddRiskFormModalVisible: EventEmitter<any> = new EventEmitter();

    riskDetailsForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

    ngOnInit(): void {
        /////////////Risk Details Starts here//////////////////
        this.riskDetailsForm = this.formBuilder.group({
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
            productType: ['', Validators.required]
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

        //////////////Risk Details Ends here///////////////
    }

    ////////////////////////////
    handleRiskEndDateCalculation(): void {
        console.log('handle risk end date calculation third party');
        if (this.selectedValue.value == 'ThirdParty') {
            this.handleBasicPremiumCalculationThirdParty();
        }

        if (
            this.riskDetailsForm.get('riskStartDate').value != '' &&
            this.riskDetailsForm.get('riskQuarter').value != ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.riskDetailsForm.get('riskStartDate').value,
                quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                    `https://new-rates-api.now.sh/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.riskDetailsForm
                        .get('riskEndDate')
                        .setValue(data.endDate);
                });
        }
    }

    handleBasicPremiumCalculation(): void {
        if (this.sumInsured != 0 && this.premiumRate != 0) {
            const request: IRateRequest = {
                sumInsured: Number(this.sumInsured),
                premiumRate: Number(this.premiumRate) / 100,
                startDate: this.riskDetailsForm.get('riskStartDate').value,
                quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                    `https://new-rates-api.now.sh/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.basicPremium = Number(data.basicPremium);
                    this.handleNetPremium();
                });
        }
    }

    handleBasicPremiumCalculationThirdParty(): void {
        console.log('handle basic premium calculation third party');
        if (
            this.riskDetailsForm.get('productType').value != '' &&
            this.riskDetailsForm.get('riskQuarter').value != ''
        ) {
            if (this.riskDetailsForm.get('productType').value == 'Private') {
                if (this.riskDetailsForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 165;
                }
                if (this.riskDetailsForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 280;
                }
                if (this.riskDetailsForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 370;
                }
                if (this.riskDetailsForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 464;
                }
            }
            if (this.riskDetailsForm.get('productType').value == 'Commercial') {
                if (this.riskDetailsForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 199;
                }
                if (this.riskDetailsForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 340;
                }
                if (this.riskDetailsForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 452;
                }
                if (this.riskDetailsForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 566;
                }
            }
            if (this.riskDetailsForm.get('productType').value == 'Bus/Taxi') {
                if (this.riskDetailsForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 270;
                }
                if (this.riskDetailsForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 464;
                }
                if (this.riskDetailsForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 618;
                }
                if (this.riskDetailsForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 772;
                }
            }
        }

        this.handleNetPremium();
    }

    // add third party risk
    addThirdPartyRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskDetailsForm.value,
            id: v4(),
            sumInsured: Number(this.sumInsured),
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
        this.sendAddRiskEmitter.emit(some);
        // this.risks = [...this.risks, ...some];

        // reset form after submitting
        this.riskDetailsForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;

        this.closeAddRiskFormModalVisible.emit();
    }

    resetThirdPartyRiskForm(e: MouseEvent) {
        e.preventDefault();
        this.riskDetailsForm.reset();
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

    addComprehensiveRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskDetailsForm.value,
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
        this.sendAddRiskEmitter.emit(some);
        // this.risks = [...this.risks, ...some];

        // reset form after submitting
        this.riskDetailsForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;

        this.closeAddRiskFormModalVisible.emit();
    }

    resetComprehensiveRiskForm(e: MouseEvent) {
        e.preventDefault();
        this.riskDetailsForm.reset();
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
        this.riskDetailsForm.reset();
        // this.riskThirdPartyForm.reset();
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

    // Premium computation methods
    // Basic Premum Computation

    handleDiscount(discountType: DiscountType) {
        this.handleDiscountIsLoading = true;
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

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskDetailsForm.get('riskStartDate').value,
            quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                `https://new-rates-api.now.sh/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.discounts.push({
                    discountType: discountType,
                    amount: Number(data.discount)
                });
                this.premiumDiscount = this.sumArray(this.discounts, 'amount');
                this.handleNetPremium();
                this.handleDiscountIsLoading = false;
            });
    }

    handleDiscountThirdParty() {
        this.handleDiscountIsLoading = true;
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
                startDate: this.riskDetailsForm.get('riskStartDate').value,
                quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                    `https://new-rates-api.now.sh/rates/comprehensive`,
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
            startDate: this.riskDetailsForm.get('riskStartDate').value,
            quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                `https://new-rates-api.now.sh/rates/comprehensive`,
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
            startDate: this.riskDetailsForm.get('riskStartDate').value,
            quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                `https://new-rates-api.now.sh/rates/comprehensive`,
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
            startDate: this.riskDetailsForm.get('riskStartDate').value,
            quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                `https://new-rates-api.now.sh/rates/comprehensive`,
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
            startDate: this.riskDetailsForm.get('riskStartDate').value,
            quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                `https://new-rates-api.now.sh/rates/comprehensive`,
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
            startDate: this.riskDetailsForm.get('riskStartDate').value,
            quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                `https://new-rates-api.now.sh/rates/comprehensive`,
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
            startDate: this.riskDetailsForm.get('riskStartDate').value,
            quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                `https://new-rates-api.now.sh/rates/comprehensive`,
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
            startDate: this.riskDetailsForm.get('riskStartDate').value,
            quarter: Number(this.riskDetailsForm.get('riskQuarter').value),
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
                `https://new-rates-api.now.sh/rates/comprehensive`,
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

    // Add risk validation
    validateriskComprehensiveFormDetails(): boolean {
        if (this.riskDetailsForm.valid) {
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

    //sum up specific values in array
    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
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
    ////////////////////////////

    showAddRiskModal(): void {
        this.isAddRiskFormModalVisible = true;
    }

    handleOk(): void {
        this.closeAddRiskFormModalVisible.emit();
    }

    handleCancel(): void {
        this.closeAddRiskFormModalVisible.emit();
    }

    //do not delete!!
    doNothing(): void {}
}
