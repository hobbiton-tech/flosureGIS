import { RiskModel } from 'src/app/quotes/models/quote.model';
import { DebitNote } from '../documents/models/documents.model';

export class Policy {
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
    risks: RiskModel[];
    debitNotes: DebitNote[];
    netPremium: number;
    underwritingYear: Date | ITimestamp;
    receiptStatus: ReceiptStatus;
    paymentPlan: PaymentPlan;
    sourceOfBusiness: string;
    intermediaryName: string;
    remarks?: string;
    term: number;
}

export interface ITimestamp {
    seconds: number;
    milliseconds: number;
}

export type Currency = 'ZMW' | 'Dollar';
export type ProductType = 'Private' | 'Commercial' | 'Bus/Taxi';
export type PolicyStatus = 'Lapsed' | 'Active' | 'Cancelled' | 'Expired';
export type InsuranceType = | 'ThirdParty'
| 'Comprehensive'
| 'ThirdPartyFireAndTheft'
| 'ActOnly';
export type ReceiptStatus = 'Unreceipted' | 'Receipted';
export type PaymentPlan = 'Created' | 'NotCreated';
export type SourceOfBusinessType =
    | 'Direct'
    | 'Broker'
    | 'Agent'
    | 'Sales Representative';
