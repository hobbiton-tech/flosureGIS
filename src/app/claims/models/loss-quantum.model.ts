import { IInsuranceCompany } from './insurance-company.model';

export interface ILossQuantum {
    id: string;
    lossType?: LossType;
    lossEstimate: number;
    adjustedQuantum: number;
    recommendation: string;
    salvageReserve?: number;
    insuranceCompanies?: IInsuranceCompany[];
}

export type LossType = 'Total Loss' | 'Partial Loss';
