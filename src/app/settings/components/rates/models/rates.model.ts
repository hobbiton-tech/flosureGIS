export interface IRate {
    id: string;
    insuranceProduct: InsuranceType;
    premiumRate: number;
    premiumLevy: number;
    taxRate: number;
}

export type InsuranceType = 'ThirdParty' | 'Comprehensive';