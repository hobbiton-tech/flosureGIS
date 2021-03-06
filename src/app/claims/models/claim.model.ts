export class Claim {
    id: string;
    claimId: string;
    policyNumber: string;
    clientName: string;
    lossDate: Date | ITimestamp;
    status: ClaimStatus;
    notificationDate: Date | ITimestamp;
    bookedBy: string;
    serviceProvider: string;
    serviceType: string;
    claimDescription: string;
    risk: string;
    activity: string;
    document?: IDocument;
}

export interface IDocument {
    name: string;
    url: string;
}

export type ClaimStatus = 'Pending' | 'Resolved' | 'Cancelled';
export interface ITimestamp {
    seconds: number;
    milliseconds: number;
}
