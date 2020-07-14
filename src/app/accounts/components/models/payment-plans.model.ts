import { Policy, ITimestamp } from 'src/app/underwriting/models/policy.model';

export class IPaymentModel {
    ID?: number;
    // clientName: string;
    client_id: string;
    number_of_policies: number;
    total_premium: number;
    status: string;
    // policyPaymentPlan: PolicyPaymentPlan[];
    // installments: InstallmentsModel[];
    // planReceipt: PlanReceipt[];
    remaining_installments: number;
    amount_paid: number;
    amount_outstanding: number;
    number_of_installments: number;
    number_of_paid_installments: number;
    start_date: Date;
    end_date?: Date;
    initial_installment_amount: number;
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
    allocatedAmount: number;
}

export class InstallmentsModel {
    ID:number;
    installment_amount: number;
    installment_date: Date | ITimestamp;
    actual_paid_date?: Date | ITimestamp;
    installment_status: InstallmentStatus;
    balance: number;
    payment_plan_id: number;
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
