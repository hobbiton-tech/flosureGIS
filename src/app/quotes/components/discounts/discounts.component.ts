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

    constructor(private premiumComputationService: PremiumComputationService) {
        this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
            riskEditMode => {
                this.isRiskEditMode = riskEditMode;
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

    // // selected no claim discount input type
    // selectedNoClaimsDiscountInputTypeValue = 'amount';
    // // no claim discount amount
    // noClaimsDiscountAmount: number;

    // // selected loyalty discount input type
    // selectedLoyaltyDiscountInputTypeValue = 'amount';
    // // loyalty discount amount
    // loyaltyDiscountAmount: number;

    // // selected valued client discount input type
    // selectedValuedClientDiscountInputTypeValue = 'amount';
    // // valued client discount amount
    // valuedClientDiscountAmount: number;

    // // selected low term agreement discount input type
    // selectedLowTermAgreementDiscountInputTypeValue = 'amount';

    // // low term agreement discount amount
    // lowTermAgreementDiscountAmount: number;

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
    }

    handleDiscount(discountType) {
        // this.handleDiscountIsLoading = true;
        // // following methods check if the repective loads are in the loads array
        // const riotAndStrikeInLoads = this.loads.some(
        //     item => item.loadType === 'Riot And Strike'
        // );
        // const increaseThirdPartyLimitInLoads = this.loads.some(
        //     item => item.loadType === 'Increased Third Party Limit'
        // );
        // const carStereoInLoads = this.loads.some(
        //     item => item.loadType === 'Car Stereo'
        // );
        // const lossOfUseInLoads = this.loads.some(
        //     item => item.loadType === 'Loss Of Use'
        // );
        // // if the checked loading are not in loads array set there values to Zero!
        // if (!riotAndStrikeInLoads) {
        //     this.riotAndStrikeRate = 0;
        // }
        // if (!increaseThirdPartyLimitInLoads) {
        //     this.increasedThirdPartyLimitsRate = 0;
        //     this.increasedThirdPartyLimitValue = 0;
        // }
        // if (!carStereoInLoads) {
        //     this.carStereoValue = 0;
        //     this.carStereoRate = 0;
        // }
        // if (!lossOfUseInLoads) {
        //     this.lossOfUseDailyRate = 0;
        //     this.lossOfUseDays = 0;
        // }
        // const request: IRateRequest = {
        //     sumInsured: Number(this.sumInsured),
        //     premiumRate: Number(this.premiumRate) / 100,
        //     startDate: this.riskComprehensiveForm.get('riskStartDate').value,
        //     quarter: Number(
        //         this.riskComprehensiveForm.get('riskQuarter').value
        //     ),
        //     appliedDiscount: Number(this.premiumDiscount),
        //     discount: Number(this.premiumDiscountRate) / 100,
        //     carStereo: Number(this.carStereoValue),
        //     carStereoRate: Number(this.carStereoRate) / 100,
        //     lossOfUseDays: Number(this.lossOfUseDays),
        //     lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
        //     territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
        //     territorialExtensionCountries: Number(
        //         this.territorialExtensionCountries
        //     ),
        //     thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
        //     thirdPartyLimitRate:
        //         Number(this.increasedThirdPartyLimitsRate) / 100,
        //     riotAndStrike: Number(this.riotAndStrikeRate) / 100,
        //     levy: 0.03
        // };
        // this.http
        //     .post<IRateResult>(
        //         `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
        //         request
        //     )
        //     .subscribe(data => {
        //         this.discounts.push({
        //             discountType,
        //             amount: Number(data.discount)
        //         });
        //         this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        //         this.handleNetPremium();
        //         this.handleDiscountIsLoading = false;
        //     });
    }

    handleDiscountThirdParty() {
        // this.handleDiscountIsLoading = true;
        // // following methods check if the repective loads are in the loads array
        // const riotAndStrikeInLoads = this.loads.some(
        //     item => item.loadType === 'Riot And Strike'
        // );
        // const increaseThirdPartyLimitInLoads = this.loads.some(
        //     item => item.loadType === 'Increased Third Party Limit'
        // );
        // const carStereoInLoads = this.loads.some(
        //     item => item.loadType === 'Car Stereo'
        // );
        // const lossOfUseInLoads = this.loads.some(
        //     item => item.loadType === 'Loss Of Use'
        // );
        // // if the checked loading are not in loads array set there values to Zero!
        // if (!riotAndStrikeInLoads) {
        //     this.riotAndStrikeRate = 0;
        // }
        // if (!increaseThirdPartyLimitInLoads) {
        //     this.increasedThirdPartyLimitsRate = 0;
        //     this.increasedThirdPartyLimitValue = 0;
        // }
        // if (!carStereoInLoads) {
        //     this.carStereoValue = 0;
        //     this.carStereoRate = 0;
        // }
        // if (!lossOfUseInLoads) {
        //     this.lossOfUseDailyRate = 0;
        //     this.lossOfUseDays = 0;
        // }
        // if (this.premiumDiscountRate != 0) {
        //     const request: IRateRequest = {
        //         sumInsured: Number(this.sumInsured),
        //         premiumRate: Number(this.premiumRate) / 100,
        //         startDate: this.riskThirdPartyForm.get('riskStartDate').value,
        //         quarter: Number(
        //             this.riskThirdPartyForm.get('riskQuarter').value
        //         ),
        //         appliedDiscount: this.premiumDiscount,
        //         discount: Number(this.premiumDiscountRate) / 100,
        //         carStereo: Number(this.carStereoValue),
        //         carStereoRate: Number(this.carStereoRate) / 100,
        //         lossOfUseDays: Number(this.lossOfUseDays),
        //         lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
        //         territorialExtensionWeeks: Number(
        //             this.territorialExtensionWeeks
        //         ),
        //         territorialExtensionCountries: Number(
        //             this.territorialExtensionCountries
        //         ),
        //         thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
        //         thirdPartyLimitRate:
        //             Number(this.increasedThirdPartyLimitsRate) / 100,
        //         riotAndStrike: Number(this.riotAndStrikeRate) / 100,
        //         levy: 0.03
        //     };
        //     this.http
        //         .post<IRateResult>(
        //             `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
        //             request
        //         )
        //         .subscribe(data => {
        //             this.premiumDiscount = Number(data.discount);
        //             this.handleNetPremium();
        //             this.handleDiscountIsLoading = false;
        //         });
        // }
    }

    // adds inputted discount to total discount amount
    handleNoClaimsDiscountAmount() {
        // this.discounts.push({
        //     discountType: 'No Claims Discount',
        //     amount: Number(this.noClaimsDiscountAmount)
        // });
        // this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        // this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleLoyaltyDiscountAmount() {
        // this.discounts.push({
        //     discountType: 'Loyalty Discount',
        //     amount: Number(this.loyaltyDiscountAmount)
        // });
        // this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        // this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleValuedClientDiscountAmount() {
        // this.discounts.push({
        //     discountType: 'Valued Client Discount',
        //     amount: Number(this.valuedClientDiscountAmount)
        // });
        // this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        // this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleLowTermAgreementDiscountAmount() {
        // this.discounts.push({
        //     discountType: 'Low Term Agreement Discount',
        //     amount: Number(this.lowTermAgreementDiscountAmount)
        // });
        // this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        // this.handleNetPremium();
    }

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
    }
}
