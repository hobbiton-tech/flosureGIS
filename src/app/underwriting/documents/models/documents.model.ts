import { Policy } from '../../models/policy.model';

export class DebitNote {
    debitNoteNumber?: string;
    remarks: string;
    dateCreated: Date;
    dateUpdated: Date;
    policy?: Policy;
}

export class CreditNote {
    creditNoteNumber?: string;
    remarks: string;
    dateCreated: Date;
    dateUpdated: Date;
    policy?: Policy;
}

export class CoverNote {
    certificateNumber?: string;
    dateCreated: Date;
    dateUpdated: Date;
    policy?: Policy;
}
