import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
    RiskModel,
    ITimestamp,
    DiscountModel,
    LoadModel
} from 'src/app/quotes/models/quote.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Policy } from 'src/app/underwriting/models/policy.model';
import * as moment from 'moment';
import { IDiscounts } from 'src/app/quotes/models/discounts.model';
import {
    PremiumComputationDetails,
    PremiumComputation
} from 'src/app/quotes/models/premium-computations.model';
import { ITotalsModel } from 'src/app/quotes/models/totals.model';
import { VehicleDetailsModel } from 'src/app/quotes/models/vehicle-details.model';
import { PropertyDetailsModel } from 'src/app/quotes/models/fire-class/property-details.model';
import { QuotesService } from 'src/app/quotes/services/quotes.service';
import { TotalsViewComponent } from 'src/app/quotes/components/totals-view/totals-view.component';
import { VehicleDetailsComponent } from 'src/app/quotes/components/vehicle-details/vehicle-details.component';
import { PropertyDetailsComponent } from 'src/app/quotes/components/fire-class/property-details/property-details.component';
import { PremiumComputationComponent } from 'src/app/quotes/components/premium-computation/premium-computation.component';
import { PremiumComputationDetailsComponent } from 'src/app/quotes/components/premium-computation-details/premium-computation-details.component';

@Component({
    selector: 'app-view-extension-risk',
    templateUrl: './view-extension-risk.component.html',
    styleUrls: ['./view-extension-risk.component.scss']
})
export class ViewExtensionRiskComponent implements OnInit {
    //check risk popover
    riskPopoverVisible: boolean = false;

    @Input()
    riskData: RiskModel;

    @Input()
    policyData: Policy;

    @Input()
    policyEndDate: Date;

    @Output()
    sendEdittedRiskExtensionEmitter: EventEmitter<any> = new EventEmitter();

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

    vehicle: VehicleDetailsModel;
    property: PropertyDetailsModel;

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

    //basic premium after extension
    extendedbasicPremium: number;

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
    discounts: IDiscounts[] = [];

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
    isViewRiskFormModalVisible: boolean;

    @Output()
    closeViewRiskFormVisible: EventEmitter<any> = new EventEmitter();

    riskDetailsForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private readonly quoteService: QuotesService,
        private totalsComponent: TotalsViewComponent,
        private vehicleDetailsComponent: VehicleDetailsComponent,
        private propertyDetailsComponent: PropertyDetailsComponent,
        private premuimComputationsComponent: PremiumComputationComponent,
        private premiumComputationDetailsComponent: PremiumComputationDetailsComponent
    ) {}

    ngOnInit(): void {
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
            productType: ['', Validators.required],
            insuranceType: ['Comprehensive']
        });
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
        this.selectedRisk = risk;
        // this.viewRiskModalVisible = true;

        this.quoteService.getVehicles().subscribe(vehicles => {
            this.vehicle = vehicles.filter(x => x.risk.id == risk.id)[0];
            this.riskDetailsModalVisible = true;
        });

        this.quoteService.getProperties().subscribe(properties => {
            this.property = properties.filter(x => x.risk.id == risk.id)[0];
            this.riskDetailsModalVisible = true;
        });

        const premiumComputationDetails: PremiumComputationDetails = {
            insuranceType: risk.insuranceType,
            productType: risk.productType,
            riskStartDate: risk.riskStartDate,
            riskEndDate: risk.riskEndDate,
            riskQuarter: risk.riskQuarter,
            numberOfDays: risk.numberOfDays,
            expiryQuarter: risk.expiryQuarter
        };

        const premimuComputations: PremiumComputation = {
            sumInsured: risk.sumInsured
        };

        const totals: ITotalsModel = {
            basicPremium: risk.basicPremium,
            premiumLevy: risk.premiumLevy,
            netPremium: risk.netPremium
        };

        this.vehicleDetailsComponent.setVehicleDetails(this.vehicle);
        this.propertyDetailsComponent.setPropertyDetails(this.property);

        this.premiumComputationDetailsComponent.setPremiumComputationDetails(
            premiumComputationDetails
        );
        this.premuimComputationsComponent.setPremiumComputations(
            premimuComputations
        );
        this.totalsComponent.setTotals(totals);
    }

    //send editted risk
    editRisk(): void {
        this.currentRiskEdit = this.riskData;

        if (this.selectedValue.value === 'Comprehensive') {
            //comprehensive risk
            const some: RiskModel = {
                ...this.riskDetailsForm.value,
                sumInsured: Number(this.sumInsured),
                premiumRate: this.premiumRate,
                basicPremium: this.basicPremium,
                loads: this.loads,
                discounts: this.discounts,
                loadingTotal: this.premiumLoadingTotal,
                discountTotal: this.premiumDiscount,
                discountSubTotal: this.premiumDiscount,
                discountRate: this.premiumDiscountRate,
                premiumLevy: this.basicPremiumLevy,
                netPremium: this.netPremium,
                insuranceType: this.selectedValue.value,
                estimatedValue: 0
            };
            this.currentRiskEdit = some;
            console.log('current riskEdit form editRisk method:');
            console.log(this.currentRiskEdit);
        } else {
            //third party risk
            const some: RiskModel = {
                ...this.riskDetailsForm.value,
                sumInsured: 0,
                premiumRate: 0,
                basicPremium: this.basicPremium,
                loads: this.loads,
                discounts: this.discounts,
                loadingTotal: this.premiumLoadingTotal,
                discountRate: this.premiumDiscountRate,
                premiumLevy: this.basicPremiumLevy,
                netPremium: this.netPremium,
                insuranceType: this.selectedValue.value
            };
            this.currentRiskEdit = some;
            console.log('current riskEdit form editRisk method:');
            console.log(this.currentRiskEdit);
        }

        this.sendEdittedRiskExtensionEmitter.emit(this.currentRiskEdit);
        this.closeViewRiskFormVisible.emit();
    }

    //resets form
    resetComprehensiveRiskForm(e: MouseEvent) {
        console.log(this.riskData);
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

    // getYearOfManfTimeStamp(risk: RiskModel): number {
    //     return (risk.yearOfManufacture as ITimestamp).seconds * 1000;
    // }

    // getStartDateTimeStamp(risk: RiskModel): number {
    //     return (risk.riskStartDate as ITimestamp).seconds * 1000;
    // }

    // getEndDateTimeStamp(risk: RiskModel): number {
    //     return (risk.riskEndDate as ITimestamp).seconds * 1000;
    // }

    handleOk(): void {
        this.closeViewRiskFormVisible.emit();
    }

    handleCancel(): void {
        this.closeViewRiskFormVisible.emit();
    }

    //recomputes premium after extension of end date
    computeExtensionPremium() {
        this.basicPremium = this.riskData.basicPremium;
        const currentRiskEndDate = this.riskData.riskEndDate;
        const extendedRiskEndDate = this.riskDetailsForm.get('riskEndDate')
            .value;

        const start = moment(currentRiskEndDate);
        const end = moment(extendedRiskEndDate);

        const differenceInDays = end.diff(start, 'days');

        const newBasicPremium =
            (differenceInDays / 365) * Number(this.riskData.basicPremium);

        this.extendedbasicPremium = newBasicPremium;

        if (this.checkRiskEndDate()) {
            console.log('basicPremium: ' + this.basicPremium);
            console.log('extendedBasicPremium: ' + this.extendedbasicPremium);
            this.basicPremium = this.basicPremium + this.extendedbasicPremium;
            console.log('basic premium after extnsion ' + this.basicPremium);
            this.handleNetPremium();
        } else {
            console.log('risk end date is beyond policy cover!');
        }
    }

    //check if risk end date is greater than policy end date
    checkRiskEndDate(): boolean {
        const riskEnd: Date = this.riskDetailsForm.get('riskEndDate').value;

        if (moment(riskEnd).isSameOrAfter(this.policyEndDate)) {
            return false;
        } else {
            this.riskDetailsForm.get('riskEndDate').markAsDirty;
            return true;
        }
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
}
