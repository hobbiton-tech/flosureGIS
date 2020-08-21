import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    InsuranceTypeOptions,
    ProductTypeOptions
} from '../../selection-options';
import moment from 'moment';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import { FormGroup } from '@angular/forms';
import { PremiumComputationService } from '../../services/premium-computation.service';
import {
    IProductType,
    PremiumComputationDetails
} from '../../models/premium-computations.model';
import { Subscription } from 'rxjs';
import { ITimestamp } from '../../models/quote.model';

@Component({
    selector: 'app-premium-computation-details',
    templateUrl: './premium-computation-details.component.html',
    styleUrls: ['./premium-computation-details.component.scss']
})
export class PremiumComputationDetailsComponent implements OnInit, OnDestroy {
    riskStartDateSubcription: Subscription;
    riskEndDateSubscription: Subscription;
    numberOfDaysSubscription: Subscription;
    expiryQuarterSubscription: Subscription;
    insuranceTypeSubscription: Subscription;
    productTypeSubscription: Subscription;
    riskQuarterSubscription: Subscription;
    riskEditModeSubscription: Subscription;
    riskExtensionModeSubscription: Subscription;

    constructor(
        private productClauseService: ClausesService,
        private premiumComputationService: PremiumComputationService
    ) {
        this.riskEndDateSubscription = this.premiumComputationService.riskEndDateChanged$.subscribe(
            riskEndDate => {
                this.riskEndDate = riskEndDate;
            }
        );
        this.numberOfDaysSubscription = this.premiumComputationService.numberOfDaysChanged$.subscribe(
            numberOfDays => {
                this.numberOfDays = numberOfDays;
            }
        );
        this.expiryQuarterSubscription = this.premiumComputationService.expiryQuarterChanged$.subscribe(
            expiryQuarter => {
                this.expiryQuarter = expiryQuarter;
            }
        );
        this.riskStartDateSubcription = this.premiumComputationService.riskStartDateChanged$.subscribe(
            riskStartDate => {
                this.riskStartDate = riskStartDate;
            }
        );
        this.insuranceTypeSubscription = this.premiumComputationService.selectedInsuranceTypeChanged$.subscribe(
            insuranceType => {
                this.selectedInsuranceType = insuranceType;
            }
        );
        this.productTypeSubscription = this.premiumComputationService.selectedProductTypeChanged$.subscribe(
            productType => {
                this.selectedProductType = productType;
            }
        );
        this.riskQuarterSubscription = this.premiumComputationService.riskQuarterChanged$.subscribe(
            riskQuarter => {
                this.riskQuarter = riskQuarter;
            }
        );

        this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
            riskEditMode => {
                this.isRiskEditMode = riskEditMode;
            }
        );

        this.riskExtensionModeSubscription = this.premiumComputationService.isExtensionChanged$.subscribe(
            extensionMode => {
                this.isExtensionMode = extensionMode;
            }
        );
    }

    // editing mode
    isRiskEditMode: boolean = true;

    // if is risk extension
    isExtensionMode: boolean = true;

    riskComprehensiveForm: FormGroup;

    // selected insurance type value
    selectedInsuranceType = '';

    // selected product type
    selectedProductType = '';

    // risk dates
    riskStartDate: Date;
    riskEndDate: Date;

    // risk quarters
    riskQuarter: string;

    // number of days
    numberOfDays: number;

    // expiry Quarter
    expiryQuarter: string;

    // insurance type options
    insuranceTypeOptions = InsuranceTypeOptions;

    // product type options
    productTypeOptions = ProductTypeOptions;

    ngOnInit(): void {}

    disabledSubmissionDate = submissionValue => {
        if (!submissionValue) {
            return false;
        }
        return submissionValue.valueOf() < moment().add(-1, 'days');
    };

    handleRiskEndDateCalculation(): void {}

    handleEndDateCalculation(): void {
        if (this.riskStartDate && this.riskQuarter) {
            this.premiumComputationService
                .calculateEndDate(this.riskStartDate, this.riskQuarter)
                .subscribe(data => {
                    // this.riskEndDate = this.premiumComputationService.getEndDate();
                });
        }

        this.changeRiskEndDate();
        this.changeRiskStartDate();
        this.changeRiskQuarter();
    }

    handleDatesCalculation(): void {
        let startDate = moment(this.riskStartDate);
        let endDate = moment(this.riskEndDate);
        let numberOfDays = endDate.diff(startDate, 'days');
        let expiryQuarter = moment(endDate).quarter();
        let expiryYear = moment(endDate)
            .year()
            .toString()
            .slice(-2);
        this.numberOfDays = numberOfDays;
        this.expiryQuarter = expiryQuarter + '/' + expiryYear;

        this.changeRiskEndDate();
        this.changeRiskQuarter();
    }

    productChanged(value) {
        // console.log('PRODUCT TYPE<<<<<', value);
        // if (value === 'Private') {
        //     this.productClauseService.getExccesses().subscribe(res => {
        //         this.excessList = res.filter(
        //             x =>
        //                 x.productId ===
        //                     '5bf2a73c-709a-4f38-9846-c260e8fffefc' &&
        //                 x.vehicleType === 'private'
        //         );
        //     });
        // } else {
        //     this.productClauseService.getExccesses().subscribe(res => {
        //         this.excessList = res.filter(
        //             x =>
        //                 x.productId ===
        //                     '5bf2a73c-709a-4f38-9846-c260e8fffefc' &&
        //                 x.vehicleType === 'commercial'
        //         );
        //     });
        // }
    }

    changeSelectedInsuranceType() {
        this.premiumComputationService.changeSelectedInsuranceType(
            this.selectedInsuranceType
        );
    }

    changeSelectedProductType() {
        this.premiumComputationService.changeProductType(
            this.selectedProductType
        );
    }

    changeRiskStartDate() {
        this.premiumComputationService.changeRiskStartDate(this.riskStartDate);
    }

    changeRiskEndDate() {
        this.premiumComputationService.changeRiskEndDate(this.riskEndDate);
        this.premiumComputationService.changeNumberOfDays(
            Number(this.numberOfDays)
        );
    }

    changeRiskQuarter() {
        this.premiumComputationService.changeRiskQuarter(this.riskQuarter);
    }

    changeNumberOfDays() {
        this.premiumComputationService.changeNumberOfDays(
            Number(this.numberOfDays)
        );
    }

    // get premium compuation details
    getPremiumComputationDetails() {
        const premiumComputationDetails: PremiumComputationDetails = {
            insuranceType: this.selectedInsuranceType,
            productType: this.selectedProductType,
            riskStartDate: this.riskStartDate,
            riskEndDate: this.riskEndDate,
            riskQuarter: this.riskQuarter,
            numberOfDays: this.numberOfDays,
            expiryQuarter: this.expiryQuarter
        };

        return premiumComputationDetails;
    }

    setPremiumComputationDetails(
        premiumComputationDetails: PremiumComputationDetails
    ) {
        this.premiumComputationService.changeSelectedInsuranceType(
            premiumComputationDetails.insuranceType
        );
        this.premiumComputationService.changeSelectedProductType(
            premiumComputationDetails.productType
        );
        this.premiumComputationService.changeRiskStartDate(
            premiumComputationDetails.riskStartDate
        );
        this.premiumComputationService.changeRiskEndDate(
            premiumComputationDetails.riskEndDate
        );
        this.premiumComputationService.changeRiskQuarter(
            premiumComputationDetails.riskQuarter
        );
        this.premiumComputationService.changeNumberOfDays(
            premiumComputationDetails.numberOfDays
        );
        this.premiumComputationService.changeExpiryQuarter(
            premiumComputationDetails.expiryQuarter
        );
    }

    ngOnDestroy() {
        this.riskEndDateSubscription.unsubscribe();
        this.numberOfDaysSubscription.unsubscribe();
        this.expiryQuarterSubscription.unsubscribe();
        this.riskStartDateSubcription.unsubscribe();
        this.productTypeSubscription.unsubscribe();
        this.insuranceTypeSubscription.unsubscribe();
        this.riskQuarterSubscription.unsubscribe();
        this.riskEditModeSubscription.unsubscribe();
        this.riskExtensionModeSubscription.unsubscribe();
    }
}
