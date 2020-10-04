import { RiskModel } from '../quote.model';
import { IMarineCargoDetailsModel } from './marine-cargo-details.model';

export interface IMarineRiskDetailsModel {
    id?: string;
    riskProductId?: string;
    riskDescription?: string;
    subClass?: string;
    risk?: RiskModel;
    marineSchedule?: IMarineCargoDetailsModel;
}
