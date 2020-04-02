export class Quote {
    quoteNumber: number;
    revisionNumber: number;
    startDate: Date;
    endDate: Date;
    client: string;
    status: QuoteStatus;
    preparedBy: string;
    risks: RiskModel[];
}

export class MotorQuotationModel {
    id: string;
    quoteNumber: string;
    dateCreated: Date;
    clientCode: string;
    messageCode: string;
    coverCode: string;
    town: string;
    currency: string;
    risks: RiskModel[];
    startDate: Date;
    endDate: Date;
    status: QuoteStatus;
    user: string;
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

export type ProductType = 'Private' | 'Commercial' | 'Bus/Taxi';

export type QuoteStatus = 'Draft' | 'Approved';

export type InsuranceType = 'ThirdParty' | 'Comprehensive';
