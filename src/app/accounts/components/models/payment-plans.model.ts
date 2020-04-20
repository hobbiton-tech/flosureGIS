import { Policy, ITimestamp } from 'src/app/underwriting/models/policy.model';

export class IPaymentModel {
    id: string;
    clientName: string;
    clientId: string;
    numberOfPolicies: number;
    totalPremium: number;
    status: PaymentPlanStatus;
    policyPaymentPlan: Policy[];
    installments: InstallmentsModel[];
    remainingInstallments: number;
    amountPaid: number;
    amountOutstanding: number;
    numberOfInstallments: number;
    numberOfPaidInstallments: number;
    startDate: Date;
    endDate: Date;
    initialInstallmentAmount: number;
}

// export class PolicyPaymentPlan {
//     policyNumber: string;
//     startDate: Date;
//     endDate: Date;
//     premium: number;
// }

export class InstallmentsModel {
    installmentAmount: number;
    installmentDate: Date | ITimestamp;
    actualPaidDate?: Date | ITimestamp;
    installmentStatus: InstallmentStatus;
    balance: number;
}

export type PaymentPlanStatus = 'Fully Paid' | 'Partially Paid' | 'UnPaid';
export type PolicyPlanStatus = 'Fully Paid' | 'Partially Paid' | 'UnPaid';

export type InstallmentStatus = 'Fully Paid' | 'Partially Paid' | 'UnPaid';
