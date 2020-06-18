export interface IRate {
    id: string;
    insuranceProduct: InsuranceType;
    description: string;
    premiumRate: number;
    premiumLevy: number;
    maxLimit: number;
    minLimit: number;
}

export interface ITax {
    id: string;
    shortName: string;
    description: string;
    rate: number;
}

export type InsuranceType = | 'ThirdParty'
| 'Comprehensive'
| 'ThirdPartyFireAndTheft'
| 'ActOnly';;