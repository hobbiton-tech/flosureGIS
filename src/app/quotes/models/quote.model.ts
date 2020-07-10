export class MotorQuotationModel {
    id: string;
    user: string;
    client: string;
    quoteNumber: string;
    dateCreated: Date | ITimestamp;
    clientCode: string;
    messageCode: string;
    coverCode: string;
    underwritingYear: Date | ITimestamp;
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
    quarter: string;
}

export class LoadModel {
    loadType: string;
    amount: number;
}

export class RiskModel {
    id: string;
    riskStartDate: Date | ITimestamp;
    riskEndDate: Date | ITimestamp;
    riskQuarter: number;
    regNumber: string;
    vehicleMake: string;
    vehicleModel: string;
    yearOfManufacture: Date;
    engineNumber: string;
    chassisNumber: string;
    cubicCapacity: string;
    seatingCapacity: string;
    bodyType: BodyType;
    color: string;
    estimatedValue?: number;
    productType: ProductType;
    insuranceType: InsuranceType;
    sumInsured?: number;
    premiumRate?: number;
    basicPremium: number;
    loads: LoadModel[];
    loadingTotal: number;
    discountTotal: number;
    discounts: DiscountModel[];
    discountSubTotal: number;
    discountRate: number;
    premiumLevy: number;
    netPremium: number;
    numberOfDays: number;
    expiryQuarter: string;
    limitsOfLiability: LimitsOfLiability[];
    excesses: Excess[];
  LiabilityType: string;
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
