export class LimitsOfLiabilityModel {
    deathAndInjuryPerPerson: number;
    deathAndInjuryPerEvent: number;
    propertyAndDamage: number;
    combinedLimits: number;
    deathAndInjuryPerPersonPremium: number;
    deathAndInjuryPerEventPremium: number;
    propertyAndDamagePremium: number;
    combinedLimitsPremium: number;
    deathAndInjuryPerPersonRate: number;
    deathAndInjuryPerEventRate: number;
    propertyAndDamageRate: number;
    combinedLimitsRate: number;
    limitsOfLiability: LimitsOfLiability[];
    liabilityType: string;
}

export class LimitsOfLiability {
    liabilityType: LiabilityType;
    amount: number;
    rate: number;
    premium: number;
}

export type LiabilityType =
    | 'deathAndInjuryPerPerson'
    | 'deathAndInjuryPerEvent'
    | 'propertyDamage'
    | 'combinedLimits';
