import { RiskModel } from '../quote.model';
import { IPersonalAccidentProductModel } from './personal-accident-product.model';

export interface IAccidentRiskDetailsModel {
    id?: string;
    riskId?: string;
    riskDescription?: string;
    subClass?: string;
    risk?: RiskModel;
    personalAccidentSchedule?: IPersonalAccidentProductModel;
}
