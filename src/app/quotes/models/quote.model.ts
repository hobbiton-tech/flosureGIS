export class Quote {
    quoteNumber: number;
    revisionNumber: number;
    startDate: Date | ITimestamp;
    endDate: Date | ITimestamp;
    client: string;
    status: QuoteStatus;
    preparedBy: string;
    risks: RiskModel[];
}

export class MotorQuotationModel {
    id: string;
    user: string;
    client: string;
    quoteNumber: string;
    dateCreated: Date | ITimestamp;
    clientCode: string;
    messageCode: string;
    coverCode: string;
    town: string;
    branch: string;
    currency: string;
    risks: RiskModel[];
    startDate: Date | ITimestamp;
    endDate: Date | ITimestamp;
    status: QuoteStatus;
    sumInsured: number;
    premiumRate: number;
    basicPremium: number;
    premiumLevy: number;
    basicPremiumSubTotal: number;
    loads: LoadModel[];
    loadingSubTotal: number;
    discount: number;
    discountRate: number;
    discountSubTotal: number;
    netPremium: number;
    receiptStatus: ReceiptStatus;
}

export class LoadModel {
    loadType: LoadType;
    amount: number;
}

export class RiskModel {
    regNumber: string;
    vehicleMake: string;
    vehicleModel: string;
    engineNumber: string;
    chassisNumber: string;
    color: string;
    estimatedValue?: number;
    productType: ProductType;
    insuranceType: InsuranceType;
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

export type ReceiptStatus = 'Unreceipted' | 'Receipted';
export type ProductType = 'Private' | 'Commercial' | 'Bus/Taxi';

export type QuoteStatus = 'Draft' | 'Approved';

export type LoadType =
    | 'Increased Third Party Limit'
    | 'Riot And Strike'
    | 'Car Stereo'
    | 'Territorial Extension'
    | 'Loss Of Use';

export type InsuranceType = 'ThirdParty' | 'Comprehensive';
