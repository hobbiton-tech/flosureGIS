export class IRequisitionModel {
    id: string;
    policyNumber: string;
    requisitionNumber: string;
    paymentVoucher?: string;
    payee: string;
    cancellationDate: Date;
    dateCreated: Date;
    approvalStatus: ApprovalStatus;
    paymentType: PaymentType;
    currency: string;
    amount: number;
    authorizedBy?: string;
    authorizationDate?: Date;
    paymentStatus?: PaymentStatus;
}

export type ApprovalStatus = 'Approved' | 'Pending';
export type PaymentType = 'PYMT' | 'GIS-COM' | 'GIS-CLAIM';
export type CurrencyType = 'ZMW' | 'Dollar';
export type PaymentStatus = 'Processed' | 'UnProcessed';
