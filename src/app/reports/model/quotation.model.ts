export class PolicyDto {
    id: string;
    policyNumber: string;
    product: string;
    startDate: Date;
    endDate: Date;
    client: string;
    clientCode: string;
    nameOfInsured: string;
    sumInsured: number;
    branch: string;
    insuranceCompany: string;
    currency: Currency;
    preparedBy: string;
    status: PolicyStatus;
    timeOfIssue: string | ITimestamp;
    expiryDate: Date | ITimestamp;
    dateOfIssue: string | ITimestamp;
    quarter: string;
    user: string;
    town: string;
    productType: ProductType;
    risks: Risks;
    netPremium: number;
    underwritingYear: Date | ITimestamp;
    receiptStatus: ReceiptStatus;
    paymentPlan: PaymentPlan;
    sourceOfBusiness: string;
    intermediaryName: string;
    remarks?: string;
    term: number;
}

export class Risks {
    id: string;
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
    loadingTotal: number;
    discountTotal: number;
    discountSubTotal: number;
    discountRate: number;
    premiumLevy: number;
    netPremium: number;
    quotation: PolicyDto;
}



export interface ITimestamp {
    seconds: number;
    milliseconds: number;
}

export type Currency = 'ZMW' | 'Dollar';
export type ProductType = 'Private' | 'Commercial' | 'Bus/Taxi';
export type PolicyStatus = 'Lapsed' | 'Active' | 'Cancelled' | 'Expired';
export type InsuranceType = 'ThirdParty' | 'Comprehensive';
export type ReceiptStatus = 'Unreceipted' | 'Receipted';
export type PaymentPlan = 'Created' | 'NotCreated';
export type SourceOfBusinessType =
    | 'Direct'
    | 'Broker'
    | 'Agent'
    | 'Sales Representative';
