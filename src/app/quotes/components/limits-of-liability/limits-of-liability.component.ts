import { Component, OnInit, OnDestroy } from '@angular/core';
import { LimitsOfLiabilityOptions } from '../../selection-options';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PremiumComputationService } from '../../services/premium-computation.service';
import { LimitsOfLiability } from '../../models/limits-of-liability.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-limits-of-liability',
    templateUrl: './limits-of-liability.component.html',
    styleUrls: ['./limits-of-liability.component.scss']
})
export class LimitsOfLiabilityComponent implements OnInit, OnDestroy {
    riskEditModeSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private premiumComputationService: PremiumComputationService
    ) {
        this.riskEditModeSubscription = this.premiumComputationService.riskEditModeChanged$.subscribe(
            riskEditMode => {
                this.isRiskEditMode = riskEditMode;
            }
        );
    }

    // editing mode
    isRiskEditMode: boolean = true;

    //combined limits form
    combinedLimitsForm: FormGroup;

    //limits of liability form
    limitsOfLiabilityForm: FormGroup;

    //limits of liability
    limitsOfLiability: LimitsOfLiability[] = [];

    //limits type options
    limitsTypeOptions = LimitsOfLiabilityOptions;

    //selected limits
    selectedLimits = { label: 'Standard', value: 'standardLimits' };

    //standard limits
    defaultDeathAndInjuryPerPersonMax = 30100;
    defaultDeathAndInjuryPerEventMax = 60100;
    defaultPropertyDamageMax = 30000;
    defaultCombinedLimitsMax =
        this.defaultDeathAndInjuryPerPersonMax +
        this.defaultDeathAndInjuryPerEventMax +
        this.defaultPropertyDamageMax;

    //standard limits rates
    defaultDeathAndInjuryPerPersonRate = 0;
    defaultDeathAndInjuryPerEventRate = 0;
    defaultPropertyDamageRate = 0;
    defaultCombinedLimitsRate = 0;

    //limits
    deathAndInjuryPerPersonMax = this.defaultDeathAndInjuryPerPersonMax;
    deathAndInjuryPerEventMax = this.defaultDeathAndInjuryPerEventMax;
    propertyDamageMax = this.defaultPropertyDamageMax;
    combinedLimitsMax =
        this.deathAndInjuryPerPersonMax +
        this.deathAndInjuryPerEventMax +
        this.propertyDamageMax;

    deathAndInjuryPerPerson = this.defaultDeathAndInjuryPerPersonMax;
    deathAndInjuryPerEvent = this.defaultDeathAndInjuryPerEventMax;
    propertyDamage = this.defaultPropertyDamageMax;
    combinedLimits =
        this.deathAndInjuryPerPerson +
        this.deathAndInjuryPerEvent +
        this.propertyDamage;

    deathAndInjuryPerPersonPremium = 0;
    deathAndInjuryPerEventPremium = 0;
    propertyDamagePremium = 0;
    combinedLimitsPremium = 0;
    limitsTotalPremium =
        this.deathAndInjuryPerPersonPremium +
        this.deathAndInjuryPerEventPremium +
        this.propertyDamagePremium +
        this.combinedLimitsPremium;

    deathAndInjuryPerPersonRate = this.defaultDeathAndInjuryPerPersonRate;
    deathAndInjuryPerEventRate = this.defaultDeathAndInjuryPerEventRate;
    propertyDamageRate = this.defaultPropertyDamageRate;
    combinedLimitsRate = this.defaultCombinedLimitsRate;

    ngOnInit(): void {
        this.limitsOfLiabilityForm = this.formBuilder.group({
            deathAndInjuryPerPerson: [
                { value: '', disabled: this.isRiskEditMode },
                Validators.required
            ],
            deathAndInjuryPerEvent: [
                { value: '', disabled: this.isRiskEditMode },
                Validators.required
            ],
            propertyDamage: [
                { value: '', disabled: this.isRiskEditMode },
                Validators.required
            ],
            deathAndInjuryPerPersonPremium: [
                { value: '', disabled: true },
                Validators.required
            ],
            deathAndInjuryPerEventPremium: [
                { value: '', disabled: true },
                Validators.required
            ],
            propertyDamagePremium: [
                { value: '', disabled: true },
                Validators.required
            ],
            deathAndInjuryPerPersonRate: [
                { value: '', disabled: this.isRiskEditMode },
                Validators.required
            ],
            deathAndInjuryPerEventRate: [
                { value: '', disabled: this.isRiskEditMode },
                Validators.required
            ],
            propertyDamageRate: [
                { value: '', disabled: this.isRiskEditMode },
                Validators.required
            ]
        });

        this.combinedLimitsForm = this.formBuilder.group({
            combinedLimits: [
                { value: '', disabled: this.isRiskEditMode },
                Validators.required
            ],
            combinedLimitsPremium: [
                { value: '', disabled: true },
                Validators.required
            ],
            combinedLimitsRate: [
                { value: '', disabled: this.isRiskEditMode },
                Validators.required
            ]
        });

        //set default values for limits of liability
        this.limitsOfLiabilityForm
            .get('deathAndInjuryPerPerson')
            .setValue('30100');
        this.limitsOfLiabilityForm
            .get('deathAndInjuryPerEvent')
            .setValue('60100');
        this.limitsOfLiabilityForm.get('propertyDamage').setValue('30000');
        this.limitsOfLiabilityForm
            .get('deathAndInjuryPerPersonPremium')
            .setValue('0');
        this.limitsOfLiabilityForm
            .get('deathAndInjuryPerEventPremium')
            .setValue('0');
        this.limitsOfLiabilityForm.get('propertyDamagePremium').setValue('0');

        // set default value for combined limits
        this.combinedLimitsForm.get('combinedLimits').setValue(93200);
        this.combinedLimitsForm.get('combinedLimitsPremium').setValue('0');
    }

    //handles combined limits calculations
    handleCombinedLimitsPremium(): void {
        this.combinedLimitsPremium =
            (Number(this.combinedLimitsForm.controls.combinedLimits.value) -
                this.combinedLimitsMax) *
            (this.combinedLimitsRate / 100);
        this.limitsTotalPremium =
            this.deathAndInjuryPerPersonPremium +
            this.deathAndInjuryPerEventPremium +
            this.propertyDamagePremium +
            this.combinedLimitsPremium;

        this.changeCombinedLimitsPremium();
    }

    handleDeathAndInjuryPerPersonPremium(): void {
        this.deathAndInjuryPerPersonPremium =
            (Number(this.deathAndInjuryPerPerson) -
                this.deathAndInjuryPerPersonMax) *
            (this.deathAndInjuryPerPersonRate / 100);
        this.limitsTotalPremium =
            this.deathAndInjuryPerPersonPremium +
            this.deathAndInjuryPerEventPremium +
            this.propertyDamagePremium +
            this.combinedLimitsPremium;

        this.ChangeDeathAndInjuryPerPersonPremium();
    }

    handleDeathAndInjuryPerEventPremium(): void {
        this.deathAndInjuryPerEventPremium =
            (Number(this.deathAndInjuryPerEvent) -
                this.deathAndInjuryPerEventMax) *
            (this.deathAndInjuryPerEventRate / 100);
        this.limitsTotalPremium =
            this.deathAndInjuryPerPersonPremium +
            this.deathAndInjuryPerEventPremium +
            this.propertyDamagePremium +
            this.combinedLimitsPremium;

        this.changeDeathAndInjuruyPerEventPremium();
    }

    handlePropertyDamagePremium(): void {
        this.propertyDamagePremium =
            (Number(this.propertyDamage) - this.propertyDamageMax) *
            (this.propertyDamageRate / 100);
        this.limitsTotalPremium =
            this.deathAndInjuryPerPersonPremium +
            this.deathAndInjuryPerEventPremium +
            this.propertyDamagePremium +
            this.combinedLimitsPremium;

        this.changePropertyDamagePremium();
    }

    //reset limits of liability
    resetLimits(): void {
        console.log(this.selectedLimits.value);
        this.deathAndInjuryPerPerson = this.defaultDeathAndInjuryPerPersonMax;
        this.deathAndInjuryPerEvent = this.defaultDeathAndInjuryPerEventMax;
        this.propertyDamage = this.defaultPropertyDamageMax;
        this.combinedLimits = this.defaultCombinedLimitsMax;
        this.deathAndInjuryPerPersonPremium = 0;
        this.deathAndInjuryPerEventPremium = 0;
        this.propertyDamagePremium = 0;
        this.combinedLimitsPremium = 0;
        this.limitsTotalPremium = 0;

        this.deathAndInjuryPerPersonRate = 0;
        this.deathAndInjuryPerEventRate = 0;
        this.propertyDamageRate = 0;
        this.combinedLimitsRate = 0;
    }

    changeCombinedLimitsPremium() {
        this.premiumComputationService.changeCombinedLimitsPremium(
            this.combinedLimitsPremium
        );
    }

    ChangeDeathAndInjuryPerPersonPremium() {
        this.premiumComputationService.changeDeathAndInjuryPerPersonPremium(
            this.deathAndInjuryPerPersonPremium
        );
    }

    changeDeathAndInjuruyPerEventPremium() {
        this.premiumComputationService.changeDeathAndInjuryPerEventPremium(
            this.deathAndInjuryPerEventPremium
        );
    }

    changePropertyDamagePremium() {
        this.premiumComputationService.changePropertyDamagePremium(
            this.propertyDamagePremium
        );
    }

    getLimitsOfLiability() {
        if (this.selectedLimits.value === 'standardLimits') {
            this.limitsOfLiability.push({
                liabilityType: 'deathAndInjuryPerPerson',
                amount: this.deathAndInjuryPerPerson,
                rate: this.deathAndInjuryPerPersonRate,
                premium: this.deathAndInjuryPerPersonPremium
            });

            this.limitsOfLiability.push({
                liabilityType: 'deathAndInjuryPerEvent',
                amount: this.deathAndInjuryPerEvent,
                rate: this.deathAndInjuryPerEventRate,
                premium: this.deathAndInjuryPerEventPremium
            });

            this.limitsOfLiability.push({
                liabilityType: 'propertyDamage',
                amount: this.propertyDamage,
                rate: this.propertyDamageRate,
                premium: this.propertyDamagePremium
            });
        } else {
            this.limitsOfLiability.push({
                liabilityType: 'combinedLimits',
                amount: this.combinedLimitsForm.controls.combinedLimits.value,
                // amount: this.combinedLimits,
                rate: this.combinedLimitsRate,
                premium: this.combinedLimitsPremium
            });
        }

        return this.limitsOfLiability;
    }

    getLiabilityType() {
        return this.selectedLimits.value;
    }

    ngOnDestroy() {
        this.riskEditModeSubscription.unsubscribe();
    }
}
