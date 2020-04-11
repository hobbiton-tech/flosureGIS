export class IPaymentModel {
    id: string;
    policyNumber: string;
    clientName: string;
    clientId: string;
    startDate: Date;
    endDate: Date;
    numberOfInstallments: number;
    numberOfPaidInstallments: number;
    amountDue: number;
    amountPaid: number;
    status: PaymentPlanStatus;
    installments: InstallmentsModel[];
    numberOfVehicles: number;
}

export class InstallmentsModel {
    installmentAmount: number;
    installmentDate: Date;
    actualPaidDate: Date;
    installmentStatus: InstallmentStatus;
}

export type PaymentPlanStatus = 'Fully Paid' | 'Partially Paid' | 'Paid';

export type InstallmentStatus = 'Fully Paid' | 'Partially Paid' | 'Paid';