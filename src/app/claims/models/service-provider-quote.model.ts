import { IServiceProvider } from './service-provider.model';
import { IDocumentUpload } from './document-upload.model';

export interface IServiceProviderQuote {
    id: string;
    serviceProvider: IServiceProvider[];
    repairesDescription: string;
    totalCost?: string;
    documentUpload: IDocumentUpload[];
}
