export interface IPremiumReport {
    id?: string;
    policyId: string;
    policyNumber: string;
    endorsementNumber: string;
    endorsementType: string;
    class: string;
    debitNoteNumber: string;
    creditNoteNumber: string;
    sumInsured: number;
    intermediaryName: string;
    startDate: Date;
    endDate: Date;
    premium: number;
    commission: number;
}

export interface IPolicyReportDto {
    id?: string;
    policyId: string;
    policyNumber: string;
    intermediaryName;
    class: string;
    startDate: Date;
    endDate: Date;
    premium: number;
    sumInsured: number;
    // CreditNoteReportDto: ICreditNoteReportDto
}

export interface ICreditNoteReportDto {
    id?: string;
    creditNoteNumber: string;
}

export interface IDebitNoteReportDto {
    id?: string;
    debitNoteNumber: string;
}

export interface IIntermediaryReportDto {
    id?: string;
    intermediaryName: string;
}

export interface ICommissionReportDto {
    id?:string;
    commission: number;
}
