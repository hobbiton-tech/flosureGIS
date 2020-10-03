import { IInsuranceCompany } from './insurance-company.model';
import { IServiceProviderQuote } from './service-provider-quote.model';

export interface ILossQuantum {
    id: string;
    lossType?: LossType;
    lossEstimate: number;
    adjustedQuantum: number;
    recommendation: string;
    salvageReserve?: number;
    insuranceCompanies?: IInsuranceCompany[];
    settlementType: SettlementType;
    dischargeAmount: number;
    selectedRepairer?: IServiceProviderQuote[];
}

export type LossType = 'Total Loss' | 'Partial Loss';
export type SettlementType = 'Reimbursement' | 'Repair';
