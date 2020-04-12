export class Policy {
    id: string;
    policyNumber: string;
    product: string;
    startDate: Date | ITimestamp;
    endDate: Date | ITimestamp;
    client: string;
    clientCode: string;
    nameOfInsured: string;
    sumInsured: number;
    branch: string;
    insuranceCompany: string;
    currency: Currency;
    preparedBy: string;
    status: PolicyStatus;
    timeOfIssue: string | ITimestamp;;
    expiryDate: Date | ITimestamp;
    dateOfIssue: string | ITimestamp;
    quarter: string;
    user: string;
    town: string;
    productType: ProductType;
    risks: RiskModel[];
    netPremium: number;
    underwritingYear: Date | ITimestamp;;
    receiptStatus: ReceiptStatus;
    paymentPlan: PaymentPlan;
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
