import { ITimestamp } from 'src/app/settings/components/insurance-companies/models/insurance-company.model';

export interface IIndividualClient {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    maritalStatus?: string;
    nationality?: string;
    clientID: string;
    gender?: GenderType;
    address: string;
    idType: IdType;
    idNumber: string;
    dateOfBirth?: Date | ITimestamp;
    dateCreated: Date | ITimestamp;
    dateUpdated: Date | ITimestamp;
    occupation?: OccupationType;
    clientType: ClientType;
    status: ClientStatus;
    sector?: string;
    accountName: string;
    accountNumber: string;
    bank: string;
    branch: string;
    accountType: string;
}

export interface ICorporateClient {
    id: string;
    phone: string;
    registrationNumber: string;
    address: string;
    clientID: string;
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    companyName: string;
    taxPin?: string;
    dateCreated: Date | ITimestamp;
    dateUpdated: Date | ITimestamp;
    clientType: ClientType;
    status: ClientStatus;
    accountName: string;
    accountNumber: string;
    bank: string;
    branch: string;
    accountType: string;
}

export interface IClientCorporate {
    id?: string;
    phoneNumber: string;
    address: string;
    firstName: string;
    lastName: string;
    email: string;
    sector: string;
    clientType: ClientType;
    status: ClientStatus;
}

export interface IClient {
    id?: string;
    title: string;
    maritalStatus: MaritalStatus;
    gender: GenderType;
    sector: string;
    dateOfBirth: Date;
    occupation: OccupationType;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    clientType: ClientType;
    idType: IdType;
    idNumber: string;
}

export interface IAccountDetails {
    bank: string;
    branch: string;
    tpinNumber: string;
    accountName: string;
    accountNumber: string;
    accountType: string;
}

export interface ICompanyDetails {
    registrationNumber: string;
    companyName: string;
    companyAddress: string;
    companyEmail: string;
    tpinNumber: string;
}

export interface IClientDTO {
    id?: string;
    title: string;
    maritalStatus: MaritalStatus;
    gender: GenderType;
    sector: string;
    dateOfBirth: Date;
    occupation: OccupationType;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    status: ClientStatus;
    clientType: ClientType;
    idType: IdType;
    idNumber: string;
    bank: string;
    branch: string;
    dateCreated: Date;
    dateUpdated: Date;
    clientId: string;
    accountName: string;
    accountNumber: string;
    accountType: string;
    contactEmail: string;
    companyName: string;
    companyAddress: string;
    companyEmail: string;
    tpinNumber: string;
    registrationNumber: string;
    address: string;
    AccountDetails: IAccountDetails;
    CompanyDetail: ICompanyDetails[];
}

export type MaritalStatus = 'Single' | 'Married';
export type ClientType = 'Individual' | 'Corporate';
export type OccupationType = 'Employed' | 'Unemployed' | 'Student';
export type GenderType = 'Male' | 'Female';
export type IdType = 'NRC' | 'Passport' | 'License';
export type ClientStatus = 'Active' | 'Inactive';
