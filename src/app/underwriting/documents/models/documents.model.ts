import { Policy } from '../../models/policy.model';

export class DebitNote {
    debitNoteNumber?: string;
    remarks: string;
    status: DebitNoteStatus;
    debitNoteAmount: number;
    remarks?: string;
    dateCreated?: Date;
    dateUpdated?: Date;
    policy?: Policy;
}

export class CreditNote {
    id?: string;
    creditNoteNumber?: string;
    remarks: string;
    status: CreditNoteStatus;
    remarks?: string;
    dateCreated?: Date;
    dateUpdated?: Date;
    policy?: Policy;
    creditNoteAmount?: number;
}

export class CoverNote {
    certificateNumber?: string;
    dateCreated: Date;
    dateUpdated: Date;
    policyId?: string;
}

export type DebitNoteStatus = 'PaidOut' | 'Pending';
export type CreditNoteStatus = 'PaidOut' | 'Pending';
