import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    DiscountModel,
    LoadModel,
    RiskModel,
    ITimestamp
} from 'src/app/quotes/models/quote.model';
import { BehaviorSubject } from 'rxjs';

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

    constructor(private formBuilder: FormBuilder) {}

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
        console.log('risk details: ');
        console.log(this.riskData);
        this.riskDetailsModalVisible = true;

        if (this.selectedValue.value === 'Comprehensive') {
            this.riskDetailsForm.get('vehicleMake').setValue(risk.vehicleMake);
            this.riskDetailsForm
                .get('vehicleModel')
                .setValue(risk.vehicleModel);
            this.riskDetailsForm
                .get('yearOfManufacture')
                .setValue(this.getYearOfManfTimeStamp(risk));
            this.riskDetailsForm.get('regNumber').setValue(risk.regNumber);
            this.riskDetailsForm
                .get('engineNumber')
                .setValue(risk.engineNumber);
            this.riskDetailsForm
                .get('chassisNumber')
                .setValue(risk.chassisNumber);
            this.riskDetailsForm.get('productType').setValue(risk.productType);
            this.riskDetailsForm
                .get('riskStartDate')
                .setValue(this.getStartDateTimeStamp(risk));
            this.riskDetailsForm.get('riskQuarter').setValue(risk.riskQuarter);
            this.riskDetailsForm
                .get('riskEndDate')
                .setValue(this.getEndDateTimeStamp(risk));
            this.riskDetailsForm.get('color').setValue(risk.color);
        } else {
            this.riskDetailsForm.get('vehicleMake').setValue(risk.vehicleMake);
            this.riskDetailsForm
                .get('vehicleModel')
                .setValue(risk.vehicleModel);
            this.riskDetailsForm
                .get('yearOfManufacture')
                .setValue(this.getYearOfManfTimeStamp(risk));
            this.riskDetailsForm.get('regNumber').setValue(risk.regNumber);
            this.riskDetailsForm
                .get('engineNumber')
                .setValue(risk.engineNumber);
            this.riskDetailsForm
                .get('chassisNumber')
                .setValue(risk.chassisNumber);
            this.riskDetailsForm.get('productType').setValue(risk.productType);
            this.riskDetailsForm
                .get('riskStartDate')
                .setValue(this.getStartDateTimeStamp(risk));
            this.riskDetailsForm.get('riskQuarter').setValue(risk.riskQuarter);
            this.riskDetailsForm
                .get('riskEndDate')
                .setValue(this.getEndDateTimeStamp(risk));
            this.riskDetailsForm.get('color').setValue(risk.color);
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

    getYearOfManfTimeStamp(risk: RiskModel): number {
        return (risk.yearOfManufacture as ITimestamp).seconds * 1000;
    }

    getStartDateTimeStamp(risk: RiskModel): number {
        return (risk.riskStartDate as ITimestamp).seconds * 1000;
    }

    getEndDateTimeStamp(risk: RiskModel): number {
        return (risk.riskEndDate as ITimestamp).seconds * 1000;
    }

    handleOk(): void {
        this.closeViewRiskFormVisible.emit();
    }

    handleCancel(): void {
        this.closeViewRiskFormVisible.emit();
    }
}
