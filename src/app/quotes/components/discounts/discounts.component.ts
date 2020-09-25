import { Component, OnInit, OnDestroy } from '@angular/core';
import { DiscountOptions } from '../../selection-options';
import { PremiumComputationService } from '../../services/premium-computation.service';
import { Subscription } from 'rxjs';
import {
    DiscountModel,
    DiscountInputType,
    IDiscounts,
    IDiscountValueModel
} from '../../models/discounts.model';

@Component({
    selector: 'app-discounts',
    templateUrl: './discounts.component.html',
    styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit, OnDestroy {
    discountsTotalSubscription: Subscription;
    discountsListChanges: Subscription;
    riskEditModeSubscription: Subscription;
    basicPremiumSubscription: Subscription;

    constructor(private premiumComputationService: PremiumComputationService) {
        this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
            riskEditMode => {
                this.isRiskEditMode = riskEditMode;
            }
        );

        this.basicPremiumSubscription = this.premiumComputationService.basicPremiumChanged$.subscribe(
            basicPremium => {
                this.basicPremium = basicPremium;
            }
        );
    }

    // editing mode
    isRiskEditMode: boolean = true;

    //discount options
    discountOptions = DiscountOptions;

    // dicounts added
    discounts: IDiscounts[] = [];

    // discounts total
    discountsTotal: number;

    //selected discount value
    selectedDiscountValue: IDiscountValueModel;

    //selected discount input type
    selectedDiscountInputTypeValue: DiscountInputType;

    // Discount for amount input type
    discountAmount: number;

    // basic premium
    basicPremium: number;

    // Discount for rate input type
    premiumDiscountRate: number;
    premiumDiscountRateType: string;
    premiumDiscount: number;
    premiumDiscountSubtotal: number;

    //loading feedback
    computeDiscountIsLoading = false;

    ngOnInit(): void {
        this.discountsTotalSubscription = this.premiumComputationService.discountsTotalChanged$.subscribe(
            discountsTotal => {
                this.discountsTotal = discountsTotal;
            }
        );

        this.discountsListChanges = this.premiumComputationService.discountsTotalChanged$.subscribe(
            discounts => {
                this.discounts = this.premiumComputationService.getDiscounts();
            }
        );

        this.selectedDiscountInputTypeValue = 'amount';
    }

    // Discount Computation
    computeDiscount() {
        this.computeDiscountIsLoading = true;

        if (this.basicPremium) {
            const discountAmount =
                (this.premiumDiscountRate / 100) * this.basicPremium;

            setTimeout(() => {
                this.premiumComputationService.addDiscount(
                    this.selectedDiscountValue.label,
                    Number(discountAmount)
                );

                this.computeDiscountIsLoading = false;
                this.selectedDiscountValue = null;
            }, 1000);
        } else {
            this.basicPremium = 0;
            const discountAmount =
                (this.premiumDiscountRate / 100) * this.basicPremium;

            setTimeout(() => {
                this.premiumComputationService.addDiscount(
                    this.selectedDiscountValue.label,
                    Number(discountAmount)
                );

                this.computeDiscountIsLoading = false;
                this.selectedDiscountValue = null;
            }, 1000);
        }
    }

    handleDiscount(discountType) {
        this.computeDiscountIsLoading = true;
    }

    handleDiscountThirdParty() {}

    // adds inputted discount to total discount amount
    handleNoClaimsDiscountAmount() {}

    // adds inputted discount to total discount amount
    handleLoyaltyDiscountAmount() {}

    // adds inputted discount to total discount amount
    handleValuedClientDiscountAmount() {}

    // adds inputted discount to total discount amount
    handleLowTermAgreementDiscountAmount() {}

    addDiscountAmount(discountType) {
        this.computeDiscountIsLoading = true;

        setTimeout(() => {
            this.premiumComputationService.addDiscount(
                this.selectedDiscountValue.label,
                Number(this.discountAmount)
            );

            this.computeDiscountIsLoading = false;
            this.selectedDiscountValue = null;
        }, 1000);
    }

    removeDiscount(i: IDiscounts, e: MouseEvent): void {
        e.preventDefault();
        if (this.discounts.length > 0) {
            const index = this.discounts.indexOf(i);
            this.discounts.splice(index, 1);
            this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        }
        // this.handleNetPremium();
    }

    // sum up specific values in array
    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }

    // get discounts
    getDiscounts() {
        const discounts: DiscountModel = {
            selectedDiscountValue: this.selectedDiscountValue,
            selectedDiscountInputValue: this.selectedDiscountInputTypeValue,
            discounts: this.discounts,
            discountsTotal: this.discountsTotal
        };

        return discounts;
    }

    ngOnDestroy() {
        this.discountsTotalSubscription.unsubscribe();
        this.discountsListChanges.unsubscribe();
        this.riskEditModeSubscription.unsubscribe();
        this.basicPremiumSubscription.unsubscribe();
    }
}
