export class Policy {
    policyNumber: string;
    endorsementNumber: string;
    product: string;
    startDate: Date;
    endDate: Date;
    client: string;
    insuranceCompany: string;
    currency: Currency;
    preparedBy: string;
    status: PolicyStatus;
}

export type Currency = 'ZMW' | 'Dollar';
export type PolicyStatus = 'Lapsed' | 'Active' | 'Cancelled' | 'Expired';
