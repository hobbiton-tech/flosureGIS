import { RiskModel } from 'src/app/quotes/models/quote.model';
import { IPeril } from 'src/app/settings/components/product-setups/models/product-setups-models.model';

export class Claim {
    id: string;
    claimantId: string;
    clientId: string;
    claimantType: string;
    lossLocation: string;
    lossEstimate: string;
    lossDate: Date;
    notificationDate: Date;
    tpFault: string;
    tpInsured: string;
    policyNumber: string;
    claimDescription: string;
    riskId: string;
    perils: string[];
    causation: string;
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
