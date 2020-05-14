export class Endorsement {
    endorsementId: string;
    endorsementType: EndorsementType;
    endorsementRemarks: string;
    createdDate: Date | ITimestamp;
    effectiveDate: Date | ITimestamp;
    status: EndorsementStatus;
}

export interface ITimestamp {
    seconds: number;
    milliseconds: number;
}

export type EndorsementStatus = 'Approved' | 'Not Approved';
export type EndorsementType =
    | 'Revision of cover'
    | 'Extension of cover'
    | 'cancellation';
