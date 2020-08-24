import { Claim } from 'src/app/claims/models/claim.model';
import { CreditNote } from 'src/app/underwriting/documents/models/documents.model';

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
    claim?: Claim;
    creditNote?: CreditNote;
}

export type ApprovalStatus = 'Approved' | 'Pending';
export type PaymentType = 'PYMT' | 'GIS-COM' | 'GIS-CLAIM';
export type CurrencyType = 'ZMW' | 'Dollar';
export type PaymentStatus = 'Processed' | 'UnProcessed';
