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
import { Peril } from './peril.model';
import { IPeril } from '../../settings/components/product-setups/models/product-setups-models.model';

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
    road: string;
    township: string;
    city: string;
    country: string;
    lossDate: Date;
    lossTime: string;
    lossEstimate: number;
    currency?: Currency;
    thirdPartyFault: ThirdPartyFault;
    thirdPartyInsured: ThirdPartyInsured;
    claimDescription?: string;
    notificationDate: Date;
    causation: string;
    claimStatus: ClaimStatus;
    isRequisitionRaised?: boolean;
    claimPerils: IPeril[];
    thirdPartyDetails: ThirdPartyDetails;
    subrogation?: Subrogation;
    subrogations?: Subrogations;
}


export class ThirdPartyDetails {
  id?: string;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  vehicleRegNumber: string;
  engineNumber: string;
  color: string;
  vehicleType: string;
}

export class Subrogations {
  status: string;
  amount: number;

}

export type ClaimStatus =
    | 'Pending'
    | 'Resolved'
    | 'Cancelled'
    | 'Processed'
    | 'Approved';
export type ThirdPartyFault = 'Insured' | 'None' | 'Third Party';

export type ThirdPartyInsured = 'Insured' | 'Not Insured';

export type Subrogation = 'NA' | 'Required' | 'Invoiced' | 'Settled';
