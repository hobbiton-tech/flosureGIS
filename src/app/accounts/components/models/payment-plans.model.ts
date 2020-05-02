import { Policy, ITimestamp } from 'src/app/underwriting/models/policy.model';

export class IPaymentModel {
    id: string;
    clientName: string;
    clientId: string;
    numberOfPolicies: number;
    totalPremium: number;
    status: PaymentPlanStatus;
    policyPaymentPlan: PolicyPaymentPlan[];
    installments: InstallmentsModel[];
    planReceipt: PlanReceipt[];
    remainingInstallments: number;
    amountPaid: number;
    amountOutstanding: number;
    numberOfInstallments: number;
    numberOfPaidInstallments: number;
    startDate: Date;
    endDate: Date;
    initialInstallmentAmount: number;
}

export class PolicyPaymentPlan {
    id: string;
    policyNumber: string;
    startDate: Date | ITimestamp;
    endDate: Date | ITimestamp;
    client: string;
    clientCode: string;
    netPremium: number;
    allocationStatus: AllocationStatus;
}

export class InstallmentsModel {
    installmentAmount: number;
    installmentDate: Date | ITimestamp;
    actualPaidDate?: Date | ITimestamp;
    installmentStatus: InstallmentStatus;
    balance: number;
}

export class PlanReceipt {
    id: string;
    receiptNumber?: string;
    onBehalfOf: string;
    sumInDigits: number;
    allocationStatus: AllocationStatus;
    policyNumber: string;
}

export type ReceiptStatus = 'Receipted' | 'Cancelled';
export type PaymentPlanStatus = 'Fully Paid' | 'Partially Paid' | 'UnPaid';
export type PolicyPlanStatus = 'Fully Paid' | 'Partially Paid' | 'UnPaid';

export type InstallmentStatus = 'Fully Paid' | 'Partially Paid' | 'UnPaid';

export type Currency = 'ZMW' | 'Dollar';
export type InsuranceType = 'ThirdParty' | 'Comprehensive';
export type AllocationStatus =
    | 'Allocated'
    | 'Partially Allocated'
    | 'Unallocated';
