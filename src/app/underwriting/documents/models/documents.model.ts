import { Policy } from '../../models/policy.model';

export class DebitNote {
    debitNoteNumber?: string;
    remarks: string;
    dateCreated: Date;
    dateUpdated: Date;
    policy?: Policy;
}

export class CreditNote {
    id?: string;
    creditNoteNumber?: string;
    remarks: string;
    dateCreated: Date;
    dateUpdated: Date;
    policy?: Policy;
    creditNoteAmount?: number;
}

export class CoverNote {
    certificateNumber?: string;
    dateCreated: Date;
    dateUpdated: Date;
    policyId?: string;
}
