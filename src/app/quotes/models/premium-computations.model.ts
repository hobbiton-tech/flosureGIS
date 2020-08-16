import { ITimestamp } from 'src/app/underwriting/models/endorsement.model';

export class PremiumComputation {
    selectedBasicPremiumInputType?: BasicPremiumInputType;
    sumInsured: number;
    basicPremiumAmount?: number;
    premiumRate?: number;
}

export class PremiumComputationDetails {
    insuranceType: string;
    productType: string;
    riskStartDate: Date;
    riskEndDate: Date;
    riskQuarter: string;
    numberOfDays: number;
    expiryQuarter: string;
}

export interface ISelectedInsuranceType {
    label: string;
    value: string;
}

export interface IProductType {
    label: string;
    value: string;
}

export type BasicPremiumInputType = 'amount' | 'rate';
