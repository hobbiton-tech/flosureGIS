import { IServiceProvider } from './service-provider.model';
import { IDocumentUpload } from './document-upload.model';

export interface ISalvage {
    id?: string;
    salvageNumber: string;
    salvageName: string;
    reserve: number;
    bidStatus: string;
  saleAmount?: number;
}
