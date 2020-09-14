import { Injectable } from '@angular/core';
import { ITimestamp } from 'src/app/underwriting/models/policy.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IExtensions } from '../models/extensions.model';
import { IDiscounts } from '../models/discounts.model';

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
    startDate: Date | ITimestamp;
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

@Injectable({
    providedIn: 'root'
})
export class InsuranceClassService {
    constructor(private http: HttpClient) {}

    //risk edit mode
    isRiskEditMode = new BehaviorSubject<boolean>(false);

    // creating quote status
    isCreatingQuote = new BehaviorSubject<boolean>(false);

    // levy rate (TODO: set up levy rate from setups)
    levyRate = 3;

    // basic premium amount when user selects amount as basic premium input type
    basicPremiumAmount = new BehaviorSubject(0);

    // sum insured
    sumInsured = new BehaviorSubject(0);

    // premium rate
    premiumRate = new BehaviorSubject(6);

    // extensions
    extensions: IExtensions[] = [];

    // discounts
    discounts: IDiscounts[] = [];

    // combined limits premium
    combinedLimitsPremium = new BehaviorSubject(0);

    // death and injury Premium
    deathAndInjuryPerPersonPremium = new BehaviorSubject(0);
    deathAndInjuryPerEventPremium = new BehaviorSubject(0);

    // property damage premium
    propertyDamagePremium = new BehaviorSubject(0);

    // risk dates
    riskStartDate = new BehaviorSubject<Date>(null);
    riskEndDate = new BehaviorSubject<Date>(null);

    // number of days for premium calculation(days from start date - end date)
    numberOfDays = new BehaviorSubject(0);

    // totals
    basicPremium = new BehaviorSubject(0);
    extensionsTotal = new BehaviorSubject(0);
    discountsTotal = new BehaviorSubject(0);
    premiumLevy = new BehaviorSubject(0);
    netPremium = new BehaviorSubject(0);

    // extended basic premium
    extendedBasicPremium: number = 0;

    //observable streams
    basicPremiumAmountChanged$ = this.basicPremiumAmount.asObservable();
    sumInsuredChanged$ = this.sumInsured.asObservable();
    premiumRateChanged$ = this.premiumRate.asObservable();
    combinedLimitsPremiumChanged$ = this.combinedLimitsPremium.asObservable();
    deathAndInjuryPerPersonPremiumChanged$ = this.deathAndInjuryPerPersonPremium.asObservable();
    deathAndInjuryPerEventPremiumChanged$ = this.deathAndInjuryPerEventPremium.asObservable();
    propertyDamagePremiumChanged$ = this.propertyDamagePremium.asObservable();
    riskStartDateChanged$ = this.riskStartDate.asObservable();
    riskEndDateChanged$ = this.riskEndDate.asObservable();
    basicPremiumChanged$ = this.basicPremium.asObservable();
    numberOfDaysChanged$ = this.numberOfDays.asObservable();
    extensionsTotalChanged$ = this.extensionsTotal.asObservable();
    discountsTotalChanged$ = this.discountsTotal.asObservable();
    premiumLevyChanged$ = this.premiumLevy.asObservable();
    netPremiumChanged$ = this.netPremium.asObservable();

    riskEditModeChanged$ = this.isRiskEditMode.asObservable();

    isCreatingQuoteChanged$ = this.isCreatingQuote.asObservable();

    changeBasicPremiumAmount(value: number) {
        this.basicPremiumAmount.next(value);
        this.computePremium();
    }

    changeSumInsured(value: number) {
        this.sumInsured.next(value);
        this.computePremium();
    }

    changePremiumRate(value: number) {
        this.premiumRate.next(value);
        this.computePremium();
    }

    changeBasicPremium(value: number) {
        this.basicPremium.next(value);
        this.computePremium();
    }

    changeLevyAmount(value: number) {
        this.premiumLevy.next(value);
    }

    changeNetPremium(value: number) {
        this.netPremium.next(value);
    }

    changeNumberOfDays(value: number) {
        this.numberOfDays.next(value);
    }

    changeCombinedLimitsPremium(value: number) {
        this.combinedLimitsPremium.next(value);
        this.computePremium();
    }
    changeDeathAndInjuryPerPersonPremium(value: number) {
        this.deathAndInjuryPerPersonPremium.next(value);
        this.computePremium();
    }
    changeDeathAndInjuryPerEventPremium(value: number) {
        this.deathAndInjuryPerEventPremium.next(value);
        this.computePremium();
    }
    changePropertyDamagePremium(value: number) {
        this.propertyDamagePremium.next(value);
        this.computePremium();
    }

    changeRiskStartDate(value: Date) {
        this.riskStartDate.next(value);
        this.computePremium();
    }

    changeRiskEndDate(value: Date) {
        this.riskEndDate.next(value);
        this.computePremium();
    }

    changeExtensionsTotal(value: number) {
        this.extensionsTotal.next(value);
        this.computePremium();
    }

    changeDiscountsTotal(value: number) {
        this.discountsTotal.next(value);
        this.computePremium();
    }

    changeRiskEditMode(value: boolean) {
        this.isRiskEditMode.next(value);
    }

    changeCreatingQuoteStatus(value: boolean) {
        this.isCreatingQuote.next(value);
    }

    // recieve extension and add to extensions list
    addExtension(extensionType: string, amount: number) {
        this.extensions.push({
            extensionType: extensionType,
            amount: amount
        });

        this.changeExtensionsTotal(this.sumArray(this.extensions, 'amount'));
        this.computePremium();
        return;
    }

    // remove extensions
    removeExtension(i: IExtensions) {
        if (this.extensions.length > 0) {
            const index = this.extensions.indexOf(i);
            this.extensions.splice(index, 1);

            this.changeExtensionsTotal(
                this.sumArray(this.extensions, 'amount')
            );
            this.computePremium();
        }
    }

    // return extensions
    getExtensions() {
        return this.extensions;
    }

    // recieve discounts and add to  discounts list
    addDiscount(discountType: string, amount: number) {
        this.discounts.push({
            discountType: discountType,
            amount: amount
        });

        this.changeDiscountsTotal(this.sumArray(this.discounts, 'amount'));
        this.computePremium();
    }

    // remove discount
    removeDiscount(i: IDiscounts): void {
        if (this.discounts.length > 0) {
            const index = this.discounts.indexOf(i);
            this.discounts.splice(index, 1);

            this.changeDiscountsTotal(this.sumArray(this.discounts, 'amount'));
            this.computePremium();
        }
    }

    // return discounts
    getDiscounts() {
        return this.discounts;
    }

    // sum up specific values in array
    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }

    computePremium() {
        let returnedBasicPremium =
            (this.numberOfDays.value / 365) *
            (Number(this.premiumRate.value) / 100) *
            Number(this.sumInsured.value);

        this.basicPremium.next(
            returnedBasicPremium + this.extendedBasicPremium
        );
        this.computeTotals();
    }

    // handle overall computations(basic premium + extension + limits premium - discounts + levy) add return net premium
    computeTotals() {
        let extensionsSum = this.sumArray(this.extensions, 'amount');
        let discountsSum = this.sumArray(this.discounts, 'amount');

        let premiumWithoutLevy =
            this.basicPremium.value +
            extensionsSum -
            discountsSum +
            this.deathAndInjuryPerPersonPremium.value +
            this.deathAndInjuryPerEventPremium.value +
            this.propertyDamagePremium.value +
            this.combinedLimitsPremium.value;

        let levyAmount = premiumWithoutLevy * (this.levyRate / 100);

        let netPremiumAmount = premiumWithoutLevy + levyAmount;

        this.extensionsTotal.next(extensionsSum);
        this.discountsTotal.next(discountsSum);
        this.premiumLevy.next(levyAmount);
        this.netPremium.next(netPremiumAmount);
    }
}
