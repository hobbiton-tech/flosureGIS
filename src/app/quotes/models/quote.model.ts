export class Quote {
    quoteNumber: number;
    revisionNumber: number;
    startDate: Date;
    endDate: Date;
    client: string;
    status: QuoteStatus;
    preparedBy: string;
}

export class MotorQuotationModel {
    id: string;
    quoteNumber: string;
    dateCreated: Date;
    clientCode: string;
    messageCode: string;
    coverCode: string;
    currency: string;
    // risks?: RiskModel[];
    startDate: Date;
    endDate: Date;
}

export class RiskModel {
  id: string;
  quoteNumber: string;
  regNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  engineNumber: string;
  chassisNumber: string;
  color: string;
  estimatedValue?: number;
  productType: ProductType;
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

export type QuoteStatus = 'Draft' | 'Confirmed';
