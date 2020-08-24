import { IntermediaryType } from './agents.model';
import { IClass } from '../../product-setups/models/product-setups-models.model';

export interface ICommissionSetup {
    id: string;
    intermediaryName: string;
    intermediaryType: IntermediaryType;
    intermediaryId: string;
    productClass: IClass;
    productName: string;
    commission: number;
}
