import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    DiscountModel,
    LoadModel,
    RiskModel,
    ITimestamp
} from 'src/app/quotes/models/quote.model';
import { BehaviorSubject } from 'rxjs';
import { IDiscounts } from 'src/app/quotes/models/discounts.model';
import { VehicleDetailsModel } from 'src/app/quotes/models/vehicle-details.model';
import { PropertyDetailsModel } from 'src/app/quotes/models/fire-class/property-details.model';
import { QuotesService } from 'src/app/quotes/services/quotes.service';
import { VehicleDetailsComponent } from 'src/app/quotes/components/vehicle-details/vehicle-details.component';
import { PropertyDetailsComponent } from 'src/app/quotes/components/fire-class/property-details/property-details.component';
import { PremiumComputationComponent } from 'src/app/quotes/components/premium-computation/premium-computation.component';
import { PremiumComputationDetailsComponent } from 'src/app/quotes/components/premium-computation-details/premium-computation-details.component';
import {
    PremiumComputationDetails,
    PremiumComputation
} from 'src/app/quotes/models/premium-computations.model';
import { ITotalsModel } from 'src/app/quotes/models/totals.model';
import { TotalsViewComponent } from 'src/app/quotes/components/totals-view/totals-view.component';

@Component({
    selector: 'app-view-cancellation-risk',
    templateUrl: './view-cancellation-risk.component.html',
    styleUrls: ['./view-cancellation-risk.component.scss']
})
export class ViewCancellationRiskComponent implements OnInit {
    @Input()
    riskData: RiskModel;

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

    vehicle: VehicleDetailsModel;
    property: PropertyDetailsModel;

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

    @Input()
    isViewRiskFormModalVisible: boolean;

    @Output()
    closeViewRiskFormVisible: EventEmitter<any> = new EventEmitter();

    riskDetailsForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private readonly quoteService: QuotesService,
        private vehicleDetailsComponent: VehicleDetailsComponent,
        private propertyDetailsComponent: PropertyDetailsComponent,
        private premuimComputationsComponent: PremiumComputationComponent,
        private premiumComputationDetailsComponent: PremiumComputationDetailsComponent,
        private totalsComponent: TotalsViewComponent
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
        // this.riskDetailsModalVisible = true;

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
}
