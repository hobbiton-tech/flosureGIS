import { IIndividualClient } from 'src/app/clients/models/clients.model';
import { ICorporateClient } from 'src/app/clients/models/client.model';
import { Policy, Currency } from 'src/app/underwriting/models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { IClaimant } from './claimant.model';
import { IPhotoUpload } from './photo-upload.model';
import { IDocumentUpload } from './document-upload.model';
import { IServiceProvider } from './service-provider.model';
import { IServiceProviderQuote } from './service-provider-quote.model';
import { ILossQuantum } from './loss-quantum.model';

export class Claim {
    id: string;
    claimNumber: string;
    client: IIndividualClient & ICorporateClient;
    policy?: Policy;
    risk?: RiskModel;
    lossQuantum?: ILossQuantum;
    claimant: IClaimant;
    photoUploads?: IPhotoUpload[];
    documentUploads?: IDocumentUpload[];
    serviceProviderRepairsQuotations?: IServiceProviderQuote[];
    lossLocation: string;
    lossDate: Date;
    lossEstimate: number;
    currency?: Currency;
    thirdPartyFault: ThirdPartyFault;
    thirdPartyInsured: ThirdPartyInsured;
    claimDescription?: string;
    notificationDate: Date;
    causation: string;
    claimStatus: ClaimStatus;
    isRequisitionRaised?: boolean;
}

export type ClaimStatus =
    | 'Pending'
    | 'Resolved'
    | 'Cancelled'
    | 'Processed'
    | 'Approved';
export type ThirdPartyFault = 'At Fault' | 'Not At Fault';

export type ThirdPartyInsured = 'Insured' | 'Not Insured';
