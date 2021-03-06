import { Policy } from './policy.model';

export class Endorsement {
    id: string;
    type: EndorsementType;
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
    | 'Revision Of Cover'
    | 'Extension Of Cover'
    | 'cancellation Of Cover';
