import { IExtensions } from './extensions.model';
import {
    IProductType,
    ISelectedInsuranceType
} from './premium-computations.model';
import { IDiscounts } from './discounts.model';

export class MotorQuotationModel {
    id?: string;
    user: number;
    client: string;
    quoteNumber?: string;
    dateCreated: Date;
    clientCode: string;
    messageCode: string;
    coverCode: string;
    underwritingYear: Date;
    branch: string;
    currency: string;
    risks: RiskModel[];
    startDate: Date | ITimestamp;
    endDate: Date | ITimestamp;
    status: QuoteStatus;
    basicPremiumSubTotal: number;
    receiptStatus: ReceiptStatus;
    sourceOfBusiness: string;
    intermediaryName: string;
    intermediaryId: string;
    quarter: string;
}

export class LoadModel {
    loadType: string;
    amount: number;
}

export class RiskModel {
    id: string;
    riskStartDate: Date;
    riskEndDate: Date;
    riskQuarter: string;
    regNumber?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    yearOfManufacture?: string;
    engineNumber?: string;
    chassisNumber?: string;
    cubicCapacity?: string;
    seatingCapacity?: string;
    bodyType?: BodyType;
    color?: string;
    estimatedValue?: number;
    productType: string;
    insuranceType: string;
    sumInsured?: number;
    premiumRate?: number;
    basicPremium: number;
    loads?: LoadModel[];
    loadingTotal?: number;
    extensions?: IExtensions[];
    extensionsTotal?: number;
    discountsTotal: number;
    discounts?: IDiscounts[];
    discountSubTotal?: number;
    discountRate?: number;
    premiumLevy: number;
    netPremium: number;
    numberOfDays: number;
    expiryQuarter: string;
    limitsOfLiability?: LimitsOfLiability[];
    excesses?: Excess[];
    LiabilityType?: string;
}

export class MessageModel {
    id: string;
    messageCode: string;
    description: string;
}

export class CoverModel {
    id: string;
    coverCode: string;
    description: string;
}

export interface ITimestamp {
    seconds: number;
    milliseconds: number;
}

export class Load {
    label: string;
    value: number;
}

export class DiscountModel {
    discountType: DiscountType;
    amount: number;
}

export class LimitsOfLiability {
    liabilityType: LiabilityType;
    amount: number;
    rate: number;
    premium;
}

export class Excess {
    excessType: string;
    amount: number;
}

export type LiabilityType =
    | 'deathAndInjuryPerPerson'
    | 'deathAndInjuryPerEvent'
    | 'propertyDamage'
    | 'combinedLimits';

// export type ExcessType =
//     | 'below21Years'
//     | 'over70Years'
//     | 'noLicence'
//     | 'careLessDriving'
//     | 'otherEndorsement';

export type ReceiptStatus = 'Unreceipted' | 'Receipted';
export type ProductType = 'Private' | 'Commercial' | 'Bus/Taxi';

export type QuoteStatus = 'Draft' | 'Approved';

// export type LoadType =
//     | 'Increased Third Party Limit'
//     | 'Riot And Strike'
//     | 'Car Stereo'
//     | 'Territorial Extension'
//     | 'Loss Of Use'
//     | 'Inexperienced Driver'
//     | 'Under Age Driver'
//     | 'Loss Of Keys'
//     | 'Malicious Damage'
//     | 'Medical Expenses'
//     | 'Injury/Death'
//     | 'Property Damage'
//     | 'Earthquake'
//     | 'Explosions'
//     | 'Financial Loss'
//     | 'Fire And Allied Perils'
//     | 'Legal Expenses'
//     | 'Landslide'
//     | 'Passenger Liability'
//     | 'Permanent Disability';

export type DiscountType =
    | 'No Claims Discount'
    | 'Loyalty Discount'
    | 'Valued Client Discount'
    | 'Low Term Agreement Discount';

export type SourceOfBusinessType =
    | 'Direct'
    | 'Broker'
    | 'Agent'
    | 'Sales Representative';

export type InsuranceType =
    | 'ThirdParty'
    | 'Comprehensive'
    | 'ActOnly'
    | 'ThirdPartyFireAndTheft';
export type BodyType = 'SEDAN' | 'VAN' | 'TRUCK' | 'SUV';
