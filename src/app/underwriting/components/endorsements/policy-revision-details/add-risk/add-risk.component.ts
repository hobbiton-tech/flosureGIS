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
import { VehicleDetailsComponent } from 'src/app/quotes/components/vehicle-details/vehicle-details.component';
import { PremiumComputationComponent } from 'src/app/quotes/components/premium-computation/premium-computation.component';
import { PremiumComputationDetailsComponent } from 'src/app/quotes/components/premium-computation-details/premium-computation-details.component';
import { ExtensionsComponent } from 'src/app/quotes/components/extensions/extensions.component';
import { DiscountsComponent } from 'src/app/quotes/components/discounts/discounts.component';
import { TotalsViewComponent } from 'src/app/quotes/components/totals-view/totals-view.component';
import { VehicleDetailsServiceService } from 'src/app/quotes/services/vehicle-details-service.service';
import { LimitsOfLiabilityComponent } from 'src/app/quotes/components/limits-of-liability/limits-of-liability.component';
import { ExcessesComponent } from 'src/app/quotes/components/excesses/excesses.component';
import { PremiumComputationService } from 'src/app/quotes/services/premium-computation.service';

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
    @Input()
    isPolicyRenewal: boolean;

    @Output()
    sendAddRiskEmitter: EventEmitter<any> = new EventEmitter();

    @Output()
    sendAddRiskToPolicyRenewalEmitter: EventEmitter<any> = new EventEmitter();

    @Input()
    policyEndDate: Date;

    @Input()
    isAddRiskFormModalVisible: boolean;

    @Output()
    closeAddRiskFormModalVisible: EventEmitter<any> = new EventEmitter();

    // risk
    risk: RiskModel;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private vehicleDetailsComponent: VehicleDetailsComponent,
        private premuimComputationsComponent: PremiumComputationComponent,
        private premiumComputationDetailsComponent: PremiumComputationDetailsComponent,
        private extensionsComponent: ExtensionsComponent,
        private discountsComponent: DiscountsComponent,
        private totalsComponent: TotalsViewComponent,
        private vehicleDetailsService: VehicleDetailsServiceService,
        private limitsOfLiabilityComponent: LimitsOfLiabilityComponent,
        private excessesComponent: ExcessesComponent,
        private premiumComputationService: PremiumComputationService
    ) {}

    ngOnInit(): void {}

    // add risk
    addRisk() {
        const vehicleDetails = this.vehicleDetailsService.getVehicleDetails();
        const premimuComputations = this.premuimComputationsComponent.getPremiumComputations();
        const premiumComputationDetails = this.premiumComputationDetailsComponent.getPremiumComputationDetails();
        const extensionDetails = this.extensionsComponent.getExtensions();
        const discountDetails = this.discountsComponent.getDiscounts();
        const totals = this.totalsComponent.getTotals();
        const limitsOfLiability = this.limitsOfLiabilityComponent.getLimitsOfLiability();
        const liabilityType = this.limitsOfLiabilityComponent.getLiabilityType();
        const excesses = this.excessesComponent.getExcesses(
            this.premiumComputationDetailsComponent.getPremiumComputationDetails()
                .insuranceType
        );

        this.risk = {
            id: v4(),
            ...vehicleDetails,
            ...premimuComputations,
            ...premiumComputationDetails,
            ...extensionDetails,
            ...discountDetails,
            ...totals,
            limitsOfLiability: limitsOfLiability,
            LiabilityType: liabilityType,
            excesses: excesses
        };

        this.sendAddRiskEmitter.emit(this.risk);
        this.closeAddRiskFormModalVisible.emit();

        this.vehicleDetailsService.resetVehicleDetails();
        this.premiumComputationService.resetRiskDetails();
        this.premiumComputationService.changeRiskEditMode(false);
        // // call a reset function..
    }

    showAddRiskModal(): void {
        this.isAddRiskFormModalVisible = true;
    }

    handleOk(): void {
        this.closeAddRiskFormModalVisible.emit();
        this.premiumComputationService.changeRiskEditMode(false);
    }

    handleCancel(): void {
        this.closeAddRiskFormModalVisible.emit();
        this.premiumComputationService.changeRiskEditMode(false);
    }

    //do not delete!!
    doNothing(): void {}
}
