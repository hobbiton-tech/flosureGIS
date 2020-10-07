import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { PremiumComputationService } from 'src/app/quotes/services/premium-computation.service';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import {
    RiskCategoryOptions,
    AccidentProductTypeOptions
} from 'src/app/quotes/selection-options';
import moment from 'moment';

@Component({
    selector: 'app-accident-premium-computation-details',
    templateUrl: './accident-premium-computation-details.component.html',
    styleUrls: ['./accident-premium-computation-details.component.scss']
})
export class AccidentPremiumComputationDetailsComponent
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
                this.selectedProductType = productType;
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
    selectedProductType = '';

    // risk dates
    riskStartDate: Date;
    riskEndDate: Date;

    // number of days
    numberOfDays: number;

    // insurance type options
    coverTypeOptions;

    // product type options
    productTypeOptions = AccidentProductTypeOptions;

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

    changeSelectedCoverType() {
        this.premiumComputationService.changeSelectedInsuranceType(
            this.selectedCoverType
        );
    }
    changeSelectedRiskCategory() {
        this.premiumComputationService.changeSelectedProductType(
            this.selectedProductType
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
