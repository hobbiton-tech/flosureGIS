import { Component, OnInit, OnDestroy } from '@angular/core';
import { PremiumComputationService } from '../../services/premium-computation.service';
import {
    PremiumComputation,
    BasicPremiumInputType
} from '../../models/premium-computations.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-premium-computation',
    templateUrl: './premium-computation.component.html',
    styleUrls: ['./premium-computation.component.scss']
})
export class PremiumComputationComponent implements OnInit, OnDestroy {
    sumInsuredSubscription: Subscription;
    basicPremiumSubscription: Subscription;
    riskEditModeSubscription: Subscription;

    constructor(private premiumComputationService: PremiumComputationService) {
        this.sumInsuredSubscription = this.premiumComputationService.sumInsuredChanged$.subscribe(
            sumInsured => {
                this.sumInsured = sumInsured;
            }
        );

        this.basicPremiumSubscription = this.premiumComputationService.basicPremiumChanged$.subscribe(
            basicPremium => {
                this.basicPremium = basicPremium;
            }
        );

        this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
            riskEditMode => {
                this.isRiskEditMode = riskEditMode;
            }
        );
    }

    // editing mode
    isRiskEditMode: boolean = true;

    // selected basic premium input type. options: rate and amount
    selectedBasicPremiunTypeValue: BasicPremiumInputType;

    // basic premium amount when user selects amount as basic premium input type
    basicPremiumAmount: number;

    // sum insured
    sumInsured: number;

    // premium rate
    premiumRate: number;

    // basic premium
    basicPremium: number;

    ngOnInit(): void {
        this.selectedBasicPremiunTypeValue = 'rate';
        this.premiumComputationService.changeSelectedBasicPremiunInputType(this.selectedBasicPremiunTypeValue);
        this.premiumRate = this.premiumComputationService.getPremiumRate();
    }

    // changes the quote basic premium to the inputed amount
    handleBasicPremiumAmount() {
        this.basicPremium = Number(this.basicPremiumAmount);
    }

    handleBasicPremiumCalculation(): void {}

    changeBasicPremiumAmount() {
        this.premiumComputationService.changeSelectedBasicPremiunInputType(this.selectedBasicPremiunTypeValue);

        this.premiumComputationService.changeBasicPremiumAmount(
            this.basicPremiumAmount
        );
    }

    changeSumInsured() {
        this.premiumComputationService.changeSumInsured(this.sumInsured);
    }

    changePremiumRate() {
        this.premiumComputationService.changePremiumRate(this.premiumRate);
    }

    changeBasicPremium() {
        this.premiumComputationService.changeBasicPremium(this.basicPremium);
    }

    // gets premium computations
    getPremiumComputations() {
        const premiumComputations: PremiumComputation = {
            selectedBasicPremiumInputType: this.selectedBasicPremiunTypeValue,
            sumInsured: this.sumInsured,
            basicPremiumAmount: this.basicPremiumAmount,
            premiumRate: this.premiumRate
        };

        return premiumComputations;
    }

    setPremiumComputations(premiumComputations: PremiumComputation) {
        this.premiumComputationService.changeSumInsured(
            premiumComputations.sumInsured
        );
    }

    ngOnDestroy() {
        this.basicPremiumSubscription.unsubscribe();
        this.sumInsuredSubscription.unsubscribe();
        this.riskEditModeSubscription.unsubscribe();
    }
}
