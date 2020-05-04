export interface IAgent {
    id: string;
    intermediaryId: string;
    companyName: string;
    tPinNumber: string;
    registrationNumber: string;
    email: string;
    phone: string;
    address: string;
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    accountName: string;
    accountNumber: number;
    accountType: string;
    branch: string;
    dateCreated: Date;
    intermediaryType: IntermediaryType;
}

export interface IBroker {
    id: string;
    intermediaryId: string;
    companyName: string;
    tPinNumber: string;
    registrationNumber: string;
    email: string;
    phone: string;
    address: string;
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
    accountName: string;
    accountNumber: number;
    accountType: string;
    bank: string;
    branch: string;
    dateCreated: Date;
    intermediaryType: IntermediaryType;
}
export interface ISalesRepresentative {
    id: string;
    intermediaryId: string;
    contactFirstName: string;
    contactMiddleName: string;
    contactLastName: string;
    contactEmail: string;
    contactPhone: string;
    contactAddess: string;
    accountName: string;
    accountNumber: number;
    accountType: string;
    bank: string;
    branch: string;
    dateCreated: Date;
    intermediaryType: IntermediaryType;
}

export type IntermediaryType = 'Agent' | 'Broker' | 'Sales Representative';
