import { Policy } from './policy.model';

export class Endorsement {
    id: string;
    type: EndorsementType;
    endorsementNumber: string;
    remark: string;
    dateCreated: Date | ITimestamp;
    dateUpdated: Date | ITimestamp;
    effectDate: Date | ITimestamp;
    status: EndorsementStatus;
    policy: Policy;
}

export interface ITimestamp {
    seconds: number;
    milliseconds: number;
}

export type EndorsementStatus = 'Approved' | 'Pending';
export type EndorsementType =
    | 'Revision_Of_Cover'
    | 'Extension_Of_Cover'
    | 'Cancellation_Of_Cover';
