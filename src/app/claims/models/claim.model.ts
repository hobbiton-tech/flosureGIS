export class Claim {
    id: string;
    claimId: string;
    policyNumber: string;
    clientName: string;
    lossDate: string | ITimestamp;
    status: ClaimStatus;
    notificationDate: string | ITimestamp;
    bookedBy: string;
    serviceProvider: string;
    serviceType: string;
    claimDescription: string;
    risk: string;
    activity: string;
}

export type ClaimStatus = 'Pending' | 'Resolved' | 'Cancelled';
export interface ITimestamp {
    seconds: string;
    milliseconds: string;
}
