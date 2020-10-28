import { Component, OnInit, OnDestroy } from '@angular/core';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { PremiumComputationService } from 'src/app/quotes/services/premium-computation.service';
import {
    CoverTypeOptions,
    RiskCategoryOptions
} from 'src/app/quotes/selection-options';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';

@Component({
    selector: 'app-fire-premium-computation-details',
    templateUrl: './fire-premium-computation-details.component.html',
    styleUrls: ['./fire-premium-computation-details.component.scss']
})
export class FirePremiumComputationDetailsComponent
    implements OnInit, OnDestroy {
    riskEditModeSubscription: Subscription;
    insuranceTypeSubscription: Subscription;
    productTypeSubscription: Subscription;
    classHandlerSubscription: Subscription;
    riskStartDateSubscription: Subscription;
    riskEndDateSubscription: Subscription;
    numberOfDaysSubscription: Subscription;

    currentClass: IClass;

    constructor(
        private premiumComputationService: PremiumComputationService,
        private classHandler: InsuranceClassHandlerService
    ) {
        this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
            riskEditMode => {
                this.isRiskEditMode = riskEditMode;
            }
        );

        this.insuranceTypeSubscription = this.premiumComputationService.selectedInsuranceTypeChanged$.subscribe(
            insuranceType => {
                this.selectedCoverType = insuranceType;
            }
        );
        this.productTypeSubscription = this.premiumComputationService.selectedProductTypeChanged$.subscribe(
            productType => {
                this.selectedRiskCategory = productType;
            }
        );

        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                // this.currentClass = currentClass;
                this.currentClass = JSON.parse(
                    localStorage.getItem('classObject')
                );
                this.coverTypeOptions = this.currentClass.products;
            }
        );

        this.riskStartDateSubscription = this.premiumComputationService.riskStartDateChanged$.subscribe(
            riskStartDate => {
                this.riskStartDate = riskStartDate;
            }
        );

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
    }

    coverTypeOptionsList = [];
    riskCategoriesList = [];

    // editing mode
    isRiskEditMode: boolean = false;

    // if is risk extension
    isExtensionMode: boolean = true;

    // selected insurance type value
    selectedCoverType = '';

    // selected product type
    selectedRiskCategory = '';

    // risk dates
    riskStartDate: Date;
    riskEndDate: Date;

    // number of days
    numberOfDays: number;

    // insurance type options
    coverTypeOptions;

    // product type options
    riskCategoryOptions = RiskCategoryOptions;

    ngOnInit(): void {}

    handleDatesCalculation(): void {
        const startDate: Date = this.riskStartDate;
        const endDate: Date = moment(startDate)
            .add('365', 'days')
            .toDate();

        this.riskEndDate = endDate;

        if (this.riskStartDate && this.riskEndDate) {
            let startDate = moment(this.riskStartDate);
            let endDate = moment(this.riskEndDate);
            let numberOfDays = endDate.diff(startDate, 'days');
            let expiryQuarter = moment(endDate).quarter();
            let expiryYear = moment(endDate)
                .year()
                .toString()
                .slice(-2);
            this.numberOfDays = numberOfDays;

            this.changeRiskEndDate();
            this.changeRiskStartDate();
        }
    }

    disabledSubmissionDate = submissionValue => {
        if (!submissionValue) {
            return false;
        }
        return submissionValue.valueOf() < moment().add(-1, 'days');
    };

    changeSelectedInsuranceType() {
        this.premiumComputationService.changeSelectedInsuranceType(
            this.selectedCoverType
        );
    }

    changeSelectedProductType() {
        this.premiumComputationService.changeProductType(
            this.selectedRiskCategory
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

    changeSelectedCoverType() {
        this.premiumComputationService.changeSelectedInsuranceType(
            this.selectedCoverType
        );
    }
    changeSelectedRiskCategory() {
        this.premiumComputationService.changeSelectedProductType(
            this.selectedRiskCategory
        );
    }

    changeNumberOfDays() {
        this.premiumComputationService.changeNumberOfDays(this.numberOfDays);
    }

    ngOnDestroy() {
        this.riskEditModeSubscription.unsubscribe();
        this.insuranceTypeSubscription.unsubscribe();
        this.productTypeSubscription.unsubscribe();
        this.classHandlerSubscription.unsubscribe();
        this.riskStartDateSubscription.unsubscribe();
        this.riskEndDateSubscription.unsubscribe();
        this.numberOfDaysSubscription.unsubscribe();
    }
}
