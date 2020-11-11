import { Injectable, OnDestroy } from '@angular/core';
import { IExtensions } from '../models/extensions.model';
import { IDiscounts } from '../models/discounts.model';
import { BehaviorSubject, Subject, Observable, Subscription } from 'rxjs';
import {
    ISelectedInsuranceType,
    IProductType,
    PremiumComputationDetails
} from '../models/premium-computations.model';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { ITimestamp } from 'src/app/underwriting/models/endorsement.model';
import { VehicleDetailsComponent } from '../components/vehicle-details/vehicle-details.component';
import { VehicleDetailsModel } from '../models/vehicle-details.model';
import { VehicleDetailsServiceService } from './vehicle-details-service.service';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { IExccess } from 'src/app/settings/models/underwriting/clause.model';

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
export class PremiumComputationService implements OnDestroy {
    classHandlerSubscription: Subscription;

    constructor(
        private http: HttpClient,
        private classHandler: InsuranceClassHandlerService
    ) {
        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                this.currentClassName = localStorage.getItem('class');
            }
        );
    }

    currentClass: IClass;
    currentClassName: string;

    // risk details editable
    isRiskEditMode = new BehaviorSubject<boolean>(false);

    // risk extension
    isExtension = new BehaviorSubject<boolean>(false);

    // riskDetailsFormValidity
    isRiskDetailsValid: boolean = false;

    // selected insurance type
    selectedInsuranceType = new BehaviorSubject<string>(null);

    // selected product type
    selectedProductType = new BehaviorSubject<string>(null);

    // vehicle detials reset
    resetVehicleDetails = new BehaviorSubject<boolean>(false);
  
  //selected basic premium input type
  selectedBasicPremiumInputType = new BehaviorSubject<string>(null);

    // values to return
    endDateToReturn: Date;
    numberOfDaysToReturn: number;
    expiryQuarterToReturn: string;

    // levy rate (TODO: set up levy rate from setups)
    levyRate = 3;

    // selected basic premium input type {options: rate, amount}
    selectedBasicPremiumTypeValue;

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

    // excesses
    excesses: IExccess[] = [];

    // combined limits premium
    combinedLimitsPremium = new BehaviorSubject(0);

    // death and injury Premium
    deathAndInjuryPerPersonPremium = new BehaviorSubject(0);
    deathAndInjuryPerEventPremium = new BehaviorSubject(0);

    // property damage premium
    propertyDamagePremium = new BehaviorSubject(0);

    // product Type
    productType = new BehaviorSubject(null);

    // risk dates
    riskStartDate = new BehaviorSubject<Date>(null);
    riskEndDate = new BehaviorSubject<Date>(null);
    dateForComputation: Date;

    // risk quarters
    riskQuarter = new BehaviorSubject(null);

    // totals
    basicPremium = new BehaviorSubject(0);
    extensionsTotal = new BehaviorSubject(0);
    discountsTotal = new BehaviorSubject(0);
    premiumLevy = new BehaviorSubject(0);
    netPremium = new BehaviorSubject(0);

    // number of days for premium calculation(days from start date - end date)
    numberOfDays = new BehaviorSubject(0);

    // expiry quarter
    expiryQuarter = new BehaviorSubject('-');

    // extended basic premium
    extendedBasicPremium: number = 0;

    // current product
    currentProduct = new BehaviorSubject<string>(null);

    // observable streams
    basicPremiumAmountChanged$ = this.basicPremiumAmount.asObservable();
    sumInsuredChanged$ = this.sumInsured.asObservable();
    premiumRateChanged$ = this.premiumRate.asObservable();
    combinedLimitsPremiumChanged$ = this.combinedLimitsPremium.asObservable();
    deathAndInjuryPerPersonPremiumChanged$ = this.deathAndInjuryPerPersonPremium.asObservable();
    deathAndInjuryPerEventPremiumChanged$ = this.deathAndInjuryPerEventPremium.asObservable();
    propertyDamagePremiumChanged$ = this.propertyDamagePremium.asObservable();
    // productTypeChanged$ = this.productType.asObservable();
    riskStartDateChanged$ = this.riskStartDate.asObservable();
    riskEndDateChanged$ = this.riskEndDate.asObservable();
    riskQuarterChanged$ = this.riskQuarter.asObservable();
    basicPremiumChanged$ = this.basicPremium.asObservable();
    numberOfDaysChanged$ = this.numberOfDays.asObservable();
    expiryQuarterChanged$ = this.expiryQuarter.asObservable();
    extensionsTotalChanged$ = this.extensionsTotal.asObservable();
    discountsTotalChanged$ = this.discountsTotal.asObservable();
    premiumLevyChanged$ = this.premiumLevy.asObservable();
    netPremiumChanged$ = this.netPremium.asObservable();
    selectedInsuranceTypeChanged$ = this.selectedInsuranceType.asObservable();
    selectedProductTypeChanged$ = this.selectedProductType.asObservable();
    selectedBasicPremiumInputTypeChanged$ = this.selectedBasicPremiumInputType.asObservable();

    riskEditModeChanged$ = this.isRiskEditMode.asObservable();

    isExtensionChanged$ = this.isExtension.asObservable();

    resetVehicleDetailsChanged$ = this.resetVehicleDetails.asObservable();

    currentProductChanges$ = this.currentProduct.asObservable();

    // methods to change respective values
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

    // changeExtendedPremium(numberOfDays: number) {
    //     this.extendedBasicPremium =
    //         (numberOfDays / 365) * this.basicPremium.value;
    //     console.log('extended premium: ', this.extendedBasicPremium);
    //     this.basicPremium.next(
    //         this.basicPremium.value + this.extendedBasicPremium
    //     );
    //     // this.computePremium();
    // }

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

    changeExpiryQuarter(value: string) {
        this.expiryQuarter.next(value);
    }

    changeCombinedLimitsPremium(value: number) {
        this.combinedLimitsPremium.next(value);
        this.computePremium();
        this.computeTotals();
    }
    changeDeathAndInjuryPerPersonPremium(value: number) {
        this.deathAndInjuryPerPersonPremium.next(value);
        this.computePremium();
        this.computeTotals();
    }
    changeDeathAndInjuryPerEventPremium(value: number) {
        this.deathAndInjuryPerEventPremium.next(value);
        this.computePremium();
        this.computeTotals();
    }
    changePropertyDamagePremium(value: number) {
        this.propertyDamagePremium.next(value);
        this.computePremium();
        this.computeTotals();
    }

    changeProductType(value: string) {
        this.selectedProductType.next(value);
        this.computePremium();
    }

    changeSelectedInsuranceType(value: string) {
        console.log('CURRENT INSURANCE TYPE');
        this.selectedInsuranceType.next(value);
    }
  
    changeSelectedBasicPremiunInputType(value: string) {
      this.selectedBasicPremiumInputType.next(value);
    }

    changeSelectedProductType(value: string) {
        this.selectedProductType.next(value);
    }

    changeRiskStartDate(value: Date) {
        this.riskStartDate.next(value);
        this.dateForComputation = value;
        this.computePremium();
    }

    changeRiskEndDate(value: Date) {
        this.riskEndDate.next(value);
        this.computePremium();
    }

    changeRiskQuarter(value: string) {
        this.riskQuarter.next(value);
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

    changeVehicleDetailsReset(value: boolean) {
        this.resetVehicleDetails.next(value);
    }

    changeExtensionMode(value: boolean) {
        this.isExtension.next(value);
    }

    changeCurrentProduct(value: string) {
        this.currentProduct.next(value);
        console.log('current product:=> ', value);
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

    setRiskDetailsValidity(valid: boolean) {
        this.isRiskDetailsValid = valid;
    }

    getRiskDetailsValidity() {
        return this.isRiskDetailsValid;
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

    // comprehensive and third party premium computation handling
    computePremium() {
        const insuranceClass = 'Fire';
        // check class

        if (localStorage.getItem('class') == 'Fire') {
            this.computeFirePremium();
        }

        if (localStorage.getItem('class') == 'Accident') {
            this.computeFirePremium();
        }

        if (localStorage.getItem('class') == 'Marine') {
            this.computeFirePremium();
        }
        if (localStorage.getItem('class') == 'Engineering') {
            this.computeFirePremium();
        }

        if (localStorage.getItem('class') == 'Motor') {
            if (this.selectedInsuranceType.value == 'Comprehensive') {
                this.computeStandardPremium();
            } else {
                this.computeThirdPartyPremium();
            }
        }
    }

    // TODO: combine all similar premium computations
    computeFirePremium() {
        let returnedBasicPremium =
            (this.numberOfDays.value / 365) *
            (Number(this.premiumRate.value) / 100) *
            Number(this.sumInsured.value) + Number(this.basicPremiumAmount.value);

        this.basicPremium.next(
            returnedBasicPremium + this.extendedBasicPremium
        );
        this.computeTotals();
    }

    // comprehensive premium
    computeStandardPremium() {
        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured.value),
            premiumRate: Number(this.premiumRate.value) / 100,
            startDate: new Date(),
            quarter: Number(this.riskQuarter.value),
            discount: 0,
            appliedDiscount: 0,
            carStereo: 0,
            carStereoRate: 0,
            territorialExtensionWeeks: 0,
            territorialExtensionCountries: 0,
            lossOfUseDays: 0,
            lossOfUseRate: 0,
            thirdPartyLimit: 0,
            thirdPartyLimitRate: 0,
            riotAndStrike: 0,
            levy: 0
        };

        this.http
            .post<IRateResult>(
                `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                let returnedBasicPremium =
                    (this.numberOfDays.value / 365) *
                    (Number(this.premiumRate.value) / 100) *
                    Number(this.sumInsured.value) + Number(this.basicPremiumAmount.value);

                this.basicPremium.next(
                    returnedBasicPremium + this.extendedBasicPremium
                );
                this.computeTotals();
            });
    }

    // third party premium
    computeThirdPartyPremium() {
        if (this.selectedProductType.value == 'Private') {
            if (this.riskQuarter.value == '1') {
                this.basicPremium.next(165 + this.extendedBasicPremium);
                this.computeTotals();
            }
            if (this.riskQuarter.value == '2') {
                this.basicPremium.next(280 + this.extendedBasicPremium);
                this.computeTotals();
            }
            if (this.riskQuarter.value == '3') {
                this.basicPremium.next(370 + this.extendedBasicPremium);
                this.computeTotals();
            }
            if (this.riskQuarter.value == '4') {
                this.basicPremium.next(464 + this.extendedBasicPremium);
                this.computeTotals();
            }
        }
        if (this.selectedProductType.value == 'Commercial') {
            if (this.riskQuarter.value == '1') {
                this.basicPremium.next(199 + this.extendedBasicPremium);
                this.computeTotals();
            }
            if (this.riskQuarter.value == '2') {
                this.basicPremium.next(340 + this.extendedBasicPremium);
                this.computeTotals();
            }
            if (this.riskQuarter.value == '3') {
                this.basicPremium.next(452 + this.extendedBasicPremium);
                this.computeTotals();
            }
            if (this.riskQuarter.value == '4') {
                this.basicPremium.next(566 + this.extendedBasicPremium);
                this.computeTotals();
            }
        }
        if (this.selectedProductType.value == 'Bus/Taxi') {
            if (this.riskQuarter.value == '1') {
                this.basicPremium.next(270 + this.extendedBasicPremium);
                this.computeTotals();
            }
            if (this.riskQuarter.value == '2') {
                this.basicPremium.next(464 + this.extendedBasicPremium);
                this.computeTotals();
            }
            if (this.riskQuarter.value == '3') {
                this.basicPremium.next(618 + this.extendedBasicPremium);
                this.computeTotals();
            }
            if (this.riskQuarter.value == '4') {
                this.basicPremium.next(772 + this.extendedBasicPremium);
                this.computeTotals();
            }
        }
    }

    // handle overall computations(basic premium + extension + limits premium - discounts + levy) add return net premium
    computeTotals() {
        let netPremium;
        let levyAmount;
      
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
      
        if (this.selectedBasicPremiumInputType == 'rate') {
          levyAmount = premiumWithoutLevy + levyAmount;
          
          netPremium = premiumWithoutLevy + levyAmount;
        }
      
        if (this.selectedBasicPremiumInputType == 'amount') {
          levyAmount = 0;
          netPremium = premiumWithoutLevy;
        }

        this.extensionsTotal.next(extensionsSum);
        this.discountsTotal.next(discountsSum);
        this.premiumLevy.next(levyAmount);
        this.netPremium.next(netPremiumAmount);
    }

    // risk end date calculation
    calculateEndDate(
        startDate: Date | ITimestamp,
        quarter: string
    ): Observable<any> {
        console.log('date', startDate);
        console.log('quarter', quarter);
        const request: IRateRequest = {
            sumInsured: 0,
            premiumRate: 0,
            startDate: startDate,
            quarter: Number(quarter),
            discount: 0,
            appliedDiscount: 0,
            carStereo: 0,
            carStereoRate: 0,
            lossOfUseDays: 0,
            lossOfUseRate: 0,
            territorialExtensionWeeks: 0,
            territorialExtensionCountries: 0,
            thirdPartyLimit: 0,
            thirdPartyLimitRate: 0,
            riotAndStrike: 0,
            levy: 0
        };

        if (startDate && quarter) {
            this.http
                .post<IRateResult>(
                    `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    const doo = new Date(data.endDate);
                    const nd = new Date(
                        doo.getTime() - doo.getTimezoneOffset() * -60000
                    );
                    let startDate = moment(this.dateForComputation);
                    let endDate = moment(nd);
                    let numberOfDays = endDate.diff(startDate, 'days');
                    let expiryQuarter = moment(endDate).quarter();
                    let expiryYear = moment(endDate)
                        .year()
                        .toString()
                        .slice(-2);

                    this.riskEndDate.next(nd);
                    this.numberOfDays.next(numberOfDays);
                    this.expiryQuarter.next(expiryQuarter + '/' + expiryYear);
                });
        }
        return this.basicPremium;
    }

    getPremiumRate() {
        return this.premiumRate.value;
    }

    setPremiumRate(value: number) {
        this.premiumRate.next(value);
    }

    setEndDateFromCalculation(date: Date) {
        this.endDateToReturn = date;
    }

    getEndDate() {
        return this.endDateToReturn;
    }
    getRiskQuarter() {
        return this.riskQuarter.value;
    }
    getExpiryQuarter() {
        return this.expiryQuarterToReturn;
    }
    getNumberOfDays() {
        return this.numberOfDaysToReturn;
    }

    resetRiskDetails() {
        this.changeVehicleDetailsReset(true);
        this.sumInsured.next(0);
        this.basicPremiumAmount.next(0);
        this.extensions = [];
        this.discounts = [];
        this.combinedLimitsPremium.next(0);
        this.deathAndInjuryPerEventPremium.next(0);
        this.deathAndInjuryPerPersonPremium.next(0);
        this.propertyDamagePremium.next(0);
        this.selectedProductType.next(null);
        this.selectedInsuranceType.next(null);
        this.riskStartDate.next(null);
        this.riskEndDate.next(null);
        this.riskQuarter.next(null);
        this.numberOfDays.next(0);
        this.expiryQuarter.next('-');
        this.basicPremium.next(0);
        this.extensionsTotal.next(0);
        this.discountsTotal.next(0);
        this.premiumLevy.next(0);
        this.netPremium.next(0);
        this.extendedBasicPremium = 0;
    }

    ngOnDestroy() {
        this.classHandlerSubscription.unsubscribe();
    }
}
