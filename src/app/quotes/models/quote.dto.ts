export interface IQuoteDTO {
    quoteNumber: number;
    revisionNumber: number;
    startDate: Date;
    endDate: Date;
    client: string;
    status: QuoteStatus;
    preparedBy: string;
    motorQuotationModelId: string;
    dateCreated: Date;
    clientCode: string;
    messageCode: string;
    coverCode: string;
    currency: string;
    riskModelId: string;
    regNumber: string;
    vehicleMake: string;
    vehicleModel: string;
    engineNumber: string;
    chassisNumber: string;
    color: string;
    estimatedValue?: number;
    productType: ProductType;
    messageModelId: string;
    description: string;
    coverModelId: string;
}

export type ProductType = 'Private' | 'Commercial' | 'Bus/Taxi';
export type QuoteStatus = 'Draft' | 'Confirmed';
