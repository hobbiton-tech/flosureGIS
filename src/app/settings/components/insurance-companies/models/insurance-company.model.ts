export class InsuranceCompany {
    id: string;
    companyName: string;
    companyEmail: string;
    contactFirstName: string;
    contactSecondName: string;
    companyCode: string;
    dateCreated: string | ITimestamp;
    contract: string;
}

export interface ITimestamp {
    seconds: number;
    milliseconds: number;
}