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
    loadType: LoadType;
    amount: number;
}

export class RiskModel {
    riskId: string;
    riskStartDate: Date | ITimestamp;
    riskEndDate: Date | ITimestamp;
    riskQuarter: number;
    regNumber: string;
    vehicleMake: string;
    vehicleModel: string;
    yearOfManufacture: Date | ITimestamp;
    engineNumber: string;
    chassisNumber: string;
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

export type ReceiptStatus = 'Unreceipted' | 'Receipted';
export type ProductType = 'Private' | 'Commercial' | 'Bus/Taxi';

export type QuoteStatus = 'Draft' | 'Approved';

export type LoadType =
    | 'Increased Third Party Limit'
    | 'Riot And Strike'
    | 'Car Stereo'
    | 'Territorial Extension'
    | 'Loss Of Use'
    | 'Inexperienced Driver'
    | 'Under Age Driver';

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

export type InsuranceType = 'ThirdParty' | 'Comprehensive';
