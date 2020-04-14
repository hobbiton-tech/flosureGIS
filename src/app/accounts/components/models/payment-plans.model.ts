export class IPaymentModel {
    id: string;
    clientName: string;
    clientId: string;
    numberOfPolicies: number;
    totalPremium: string;
    status: PaymentPlanStatus;
    policyPaymentPlan: PolicyPaymentPlan[];
}

export class PolicyPaymentPlan {
    policyNumber: string;
    startDate: Date;
    endDate: Date;
    numberOfInstallments: number;
    numberOfPaidInstallments: number;
    amountDue: number;
    amountPaid: number;
    amountOutstanding: number;
    policyPlanStatus: PolicyPlanStatus;
    remainingInstallments: number;
    premium: number;
    installments: InstallmentsModel[];
}

export class InstallmentsModel {
    installmentAmount: number;
    installmentDate: Date;
    actualPaidDate?: Date;
    installmentStatus: InstallmentStatus;
    balance: number;
}

export type PaymentPlanStatus = 'Fully Paid' | 'Partially Paid' | 'UnPaid';
export type PolicyPlanStatus = 'Fully Paid' | 'Partially Paid' | 'UnPaid';

export type InstallmentStatus = 'Fully Paid' | 'Partially Paid' | 'UnPaid';
