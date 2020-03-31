export class Policy {
    policyNumber: string;
    product: string;
    startDate: Date;
    endDate: Date;
    client: string;
    nameOfInsured: string;
    sumInsured: number;
    insuranceCompany: string;
    currency: Currency;
    preparedBy: string;
    status: PolicyStatus;
    timeOfIssue: string;
    expiryDate: Date;
    dateOfIssue: string;
    quater: string;
    town: string;
    productType: ProductType;
    risks: RiskModel[];
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

export type Currency = 'ZMW' | 'Dollar';
export type ProductType = 'Private' | 'Commercial' | 'Bus/Taxi';
export type PolicyStatus = 'Lapsed' | 'Active' | 'Cancelled' | 'Expired';
export type InsuranceType = 'ThirdParty' | 'Comprehensive';
