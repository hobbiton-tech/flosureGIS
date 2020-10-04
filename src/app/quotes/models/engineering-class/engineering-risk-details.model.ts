import { RiskModel } from '../quote.model';
import { IEngineeringItemDetails } from './engineering-item-details.model';

export interface IEngineeringRiskDetailsModel {
    id?: string;
    riskProductId?: string;
    riskDescription?: string;
    subClass?: string;
    risk?: RiskModel;
    engineeringItemDetails?: IEngineeringItemDetails;
}
